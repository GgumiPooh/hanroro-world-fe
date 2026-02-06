import { useAlbumDetail } from "@/hooks/backend/useAlbumDetail";
import type { FC } from "react";
import { Link } from "react-router";

const AlbumDetailViewer: FC<{ albumId: string | number }> = ({ albumId }) => {
  const { detailView } = useAlbumDetail(albumId);

  return (
    <div className="w-full">
      <ul className="divide-y divide-plum-300/30">
        {detailView?.songsView.map((song) => (
          <li key={song.id} className="py-5">
            <div className="flex">
              <Link
                to={`/album/${albumId}/song/${song.id}`}
                className="flex w-full items-center justify-start text-start text-2xl text-plum-100"
              >
                <span className="pr-5 text-2xl font-medium text-plum-500">
                  {song.track_number}
                </span>
                {song.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumDetailViewer;
