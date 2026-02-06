import BlurBackground from "@/components/BlurBackground";
import Button from "@/components/Button";
import SongDetailViewer from "@/components/SongDetailViewer";
import { useAlbums } from "@/hooks/backend/useAlbums";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

const SongDetail: FC = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { albumsView } = useAlbums();
  const album = useMemo(
    () => albumsView.find((a) => String(a.id) === albumId),
    [albumsView, albumId],
  );
  return (
    <div className="relative overflow-y-auto pt-40 md:pt-50">
      <BlurBackground
        src={album?.coverUrl}
        alt={album?.titleText}
        imgClassName="scale-105 blur-md"
      />

      <div className="fixed inset-0 -z-1 bg-gray-800/60" />

      <div className="z-2 mx-auto w-[min(92vw,1000px)]">
        {/* 이전으로 돌아가기 버튼 */}
        <Button
          variant="icon"
          size="md"
          className="mb-10 pl-10 text-sm text-plum-200"
          onClick={() =>
            album?.album_type === "DIGITAL_SINGLE"
              ? navigate("/albums")
              : navigate(`/album/${albumId}`)
          }
        >
          <ArrowLeftIcon className="size-5 text-plum-100" />
        </Button>
        <SongDetailViewer />
      </div>
    </div>
  );
};

export default SongDetail;
