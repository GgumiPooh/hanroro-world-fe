import AlbumTrackList from "@/components/AlbumTrackList";
import BlurBackground from "@/components/BlurBackground";
import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbums } from "@/hooks/useAlbums";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";

const AlbumDetail: FC = () => {
  const { albumId } = useParams();
  const { albumsView } = useAlbums();
  const [showDescription, setShowDescription] = useState(false);

  const album = useMemo(
    () => albumsView.find((albumItem) => String(albumItem.id) === albumId),
    [albumsView, albumId],
  );

  return (
    <div className="relative overflow-y-auto pt-30 md:pt-50">
      <BlurBackground
        src={album?.coverUrl}
        alt={album?.titleText}
        imgClassName="scale-105 blur-sm"
      />
      <div className="fixed inset-0 -z-1 bg-gray-800/75" />

      <div className="z-2 mx-auto w-[min(92vw,900px)]">
        {album?.coverUrl && (
          <div className="relative mx-5 mb-10">
            <Link
              to="/albums"
              className="mb-10 inline-flex text-sm text-plum-200"
            >
              <ArrowLeftIcon className="size-5 text-plum-100" />
            </Link>
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-end lg:gap-20">
              <ImageWithPlaceholder
                src={album.coverUrl}
                alt={album.titleText}
                className="h-60 w-60 shrink-0 object-cover shadow-md sm:h-70 sm:w-70 md:h-75 md:w-75 lg:h-85 lg:w-85"
              />
              <div className="flex flex-col items-center gap-2 md:items-start">
                <div className="text-2xl font-bold text-plum-100 sm:text-3xl md:text-4xl">
                  {album.titleText}
                </div>
                <Button
                  variant="icon"
                  size="sm"
                  onClick={handleToggleDescription}
                  className="ml-6 self-start p-0 text-plum-300 md:ml-0"
                >
                  {showDescription ? (
                    <span className="text-bold">▲</span>
                  ) : (
                    <span className="text-bold">▼ 앨범소개</span>
                  )}
                </Button>
                <div
                  className={`overflow-hidden text-xs whitespace-pre-wrap text-plum-200/80 transition-all duration-400 ease-in-out md:text-base ${showDescription ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {album.descriptionText}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mx-5 mb-10 text-sm md:text-base">
          {albumId && <AlbumTrackList albumId={albumId} />}
        </div>
      </div>
    </div>
  );

  function handleToggleDescription() {
    setShowDescription(!showDescription);
  }
};

export default AlbumDetail;
