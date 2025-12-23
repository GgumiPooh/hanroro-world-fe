import Button from "@/components/Button";
import { useAlbumDetailSupabase } from "@/hooks/supabase/useAlbumDetailSupabase";
import type { FC } from "react";
import { useNavigate } from "react-router";

const AlbumDetailViewer: FC<{ albumId: string | number }> = ({ albumId }) => {
  const { detailView } = useAlbumDetailSupabase(albumId);
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <ul className="divide-y divide-plum-300/30">
        {detailView?.songsView.map((song, idx) => (
          <li key={song.id} className="py-5">
            <div className="flex">
              <Button
                variant="icon"
                size="md"
                className="w-full justify-start text-start text-2xl text-plum-100"
                onClick={() => navigate(`/album/${albumId}/song/${song.id}`)}
              >
                <span className="pr-5 text-2xl font-medium text-plum-300">
                  {song.track_number}
                </span>
                {song.title}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumDetailViewer;
