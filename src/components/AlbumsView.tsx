import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbumsSupabase } from "@/hooks/supabase/useAlbumsSupabase";
import type { FC } from "react";
import { useNavigate } from "react-router";

const getUrlsByType = (meta: { type: string; url: string }[], type: string) => {
  const found = meta.find((m) => m.type === type);
  return found ? found.url : (meta[0]?.url ?? "");
};

const AlbumsView: FC = () => {
  const { albumsView, isLoading, error } = useAlbumsSupabase();
  const navigate = useNavigate();

  if (isLoading) {
    return <p className="mb-20 text-center text-plum-100/80">Loading...</p>;
  }
  if (error) {
    return (
      <p className="text-red-200 mb-20 text-center">Failed to load albums</p>
    );
  }

  return (
    <ul className="">
      {albumsView.map((item) => {
        const cover = getUrlsByType(item.metadata ?? [], "img");
        const title = item.titleText || "Untitled Album";
        const dateStr = item.published_at ?? "";

        const isDigitalSingle = item.album_type === "DIGITAL_SINGLE";
        const targetPath =
          `/album/${item.id}` +
          (isDigitalSingle && item.firstSongId
            ? `/song/${item.firstSongId}`
            : "");

        return (
          <li
            key={String(item.id)}
            className="mb-20 rounded-xl bg-gray-900/40 backdrop-blur-md md:mb-50"
          >
            <Button
              variant="icon"
              size="sm"
              className="flex p-0"
              onClick={() => navigate(targetPath)}
            >
              <div className="flex flex-row items-center gap-7">
                <ImageWithPlaceholder
                  className="relative h-25 w-25 items-center gap-5 sm:h-50 sm:w-50 sm:gap-15 lg:h-60 lg:w-60"
                  imgClassName="absolute size-full shrink-0 bg-plum-800/60 object-cover object-center"
                  src={cover}
                  alt={title}
                />
                <div className="min-w-0 text-left">
                  <h2 className="text-base font-bold text-plum-100 sm:text-2xl md:text-3xl">
                    {title}
                  </h2>
                  {dateStr && (
                    <p className="mt-2 text-sm text-plum-300/70 md:text-lg">
                      {dateStr.replaceAll("-", ".")}
                    </p>
                  )}
                </div>
              </div>
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export default AlbumsView;
