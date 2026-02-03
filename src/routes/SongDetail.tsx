import BlurBackground from "@/components/BlurBackground";
import Button from "@/components/Button";
import SongInfo from "@/components/SongInfo";
import { useAlbums } from "@/hooks/useAlbums";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

const SongDetail: FC = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { albumsView } = useAlbums();
  const album = useMemo(
    () => albumsView.find((albumItem) => String(albumItem.id) === albumId),
    [albumsView, albumId],
  );
  return (
    <div className="relative overflow-y-auto pt-40 md:pt-50">
      <BlurBackground
        src={album?.coverUrl}
        alt={album?.titleText}
        imgClassName="scale-105 blur-md"
      />

      <div className="fixed inset-0 -z-1 bg-gray-800/75" />

      <div className="z-2 mx-auto w-[min(92vw,1000px)]">
        <Button
          variant="icon"
          size="md"
          className="mb-10 pl-10 text-sm text-plum-200"
          onClick={handleNavigateBack}
        >
          <ArrowLeftIcon className="size-5 text-plum-100" />
        </Button>
        <SongInfo />
      </div>
    </div>
  );

  function handleNavigateBack() {
    if (album?.album_type === "DIGITAL_SINGLE") {
      navigate("/albums");
    } else {
      navigate(`/album/${albumId}`);
    }
  }
};

export default SongDetail;
