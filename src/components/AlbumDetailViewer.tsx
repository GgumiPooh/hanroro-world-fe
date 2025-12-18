import { useAlbumDetail } from "@/hooks/useAlbumDetail";
import type { FC } from "react";

const AlbumDetailViewer: FC<{ albumId: string | number }> = ({ albumId }) => {
  const { detailView } = useAlbumDetail(albumId);

  return (
    <div className="w-full">
      <ul className="divide-y divide-plum-300/30">
        {detailView?.songsView.map((song, idx) => (
          <li key={song.id} className="py-5">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-medium text-plum-300">
                {idx + 1}
              </span>
              <h3 className="text-xl font-semibold text-plum-100 sm:text-2xl">
                {song.title}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumDetailViewer;
