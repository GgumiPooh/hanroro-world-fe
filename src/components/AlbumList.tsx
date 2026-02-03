import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbums } from "@/hooks/useAlbums";
import { cn } from "@/utils/styles";
import type { FC } from "react";
import { Link } from "react-router";

type Props = {
  className?: string;
};

function findMetadataUrl(
  metadata: { type: string; url: string }[],
  targetType: string,
): string {
  const matched = metadata.find((item) => item.type === targetType);
  return matched ? matched.url : (metadata[0]?.url ?? "");
}

const AlbumList: FC<Props> = ({ className }) => {
  const { albumsView, isLoading, error } = useAlbums();

  if (isLoading) {
    return <p className="mb-20 text-center text-plum-100/80">Loading...</p>;
  }
  if (error) {
    return (
      <p className="text-red-200 mb-20 text-center">Failed to load albums</p>
    );
  }

  return (
    <ul className={cn(className)}>
      {albumsView.map((albumItem) => {
        const coverUrl = findMetadataUrl(albumItem.metadata ?? [], "img");
        const albumTitle = albumItem.titleText || "Untitled Album";
        const publishedDate = albumItem.published_at ?? "";

        const isDigitalSingle = albumItem.album_type === "DIGITAL_SINGLE";
        const targetPath =
          `/album/${albumItem.id}` +
          (isDigitalSingle && albumItem.firstSongId
            ? `/song/${albumItem.firstSongId}`
            : "");

        return (
          <li
            key={String(albumItem.id)}
            className="mb-20 rounded-xl bg-gray-900/40 backdrop-blur-md md:mb-50"
          >
            <Link to={targetPath} className="flex p-0">
              <div className="flex flex-row items-center gap-5 sm:gap-10 md:gap-15">
                <ImageWithPlaceholder
                  className="relative h-25 w-25 items-center gap-5 sm:h-50 sm:w-50 sm:gap-15 lg:h-60 lg:w-60"
                  imgClassName="absolute size-full shrink-0 bg-plum-800/60 object-cover object-center"
                  src={coverUrl}
                  alt={albumTitle}
                />
                <div className="min-w-0 text-left">
                  <h2 className="font-medium text-plum-100 sm:text-2xl md:text-3xl">
                    {albumTitle}
                  </h2>
                  {publishedDate && (
                    <p className="mt-2 text-sm text-plum-300/70 md:text-lg">
                      {publishedDate.replaceAll("-", ".")}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default AlbumList;
