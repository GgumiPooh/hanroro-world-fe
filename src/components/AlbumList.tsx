import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbums } from "@/hooks/useAlbums";
import { findMetadataUrl } from "@/utils/metadata";
import { cn } from "@/utils/styles";
import type { FC } from "react";
import { Link } from "react-router";

type Props = {
  className?: string;
};

const AlbumList: FC<Props> = ({ className }) => {
  const { albumsView, isLoading, error } = useAlbums();

  return (
    <ul className={cn(className)}>
      {isLoading ? (
        <p className="mb-20 text-center text-plum-100/80">Loading...</p>
      ) : error ? (
        <p className="mb-20 text-center text-red-200">Failed to load albums</p>
      ) : (
        albumsView.map((albumItem) => (
          <AlbumItem key={albumItem.id} album={albumItem} />
        ))
      )}
    </ul>
  );
};

type AlbumItemProps = {
  album: ReturnType<typeof useAlbums>["albumsView"][number];
};

const AlbumItem: FC<AlbumItemProps> = ({ album }) => {
  const coverUrl = findMetadataUrl(album.metadata ?? [], "img");
  const albumTitle = album.titleText || "Untitled Album";
  const publishedDate = album.publishedAt ?? "";

  const isDigitalSingle = album.albumType === "DIGITAL_SINGLE";
  const targetPath = `/album/${album.id}` + (isDigitalSingle ? "/song/1" : "");
  return (
    <li className="mb-20 rounded-xl bg-gray-900/40 backdrop-blur-md md:mb-50">
      <Link className="flex p-0" to={targetPath}>
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
};

export default AlbumList;
