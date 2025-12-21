import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import SongDetailViewer from "@/components/SongDetailViewer";
import { useAlbumsSupabase } from "@/hooks/supabase/useAlbumsSupabase";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

const SongDetail: FC = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { albumsView } = useAlbumsSupabase();
  const album = useMemo(
    () => albumsView.find((a) => String(a.id) === albumId),
    [albumsView, albumId],
  );
  return (
    <div className="relative overflow-y-auto pt-40 md:pt-50">
      {/* Glow background from album cover (fallback to default banner) */}
      {album?.coverUrl ? (
        <ImageWithPlaceholder
          className="fixed inset-0 -z-2 h-dvh w-full"
          imgClassName="h-full w-full scale-110 object-cover blur-lg saturate-150 backdrop-blur"
          src={album.coverUrl}
          alt="album glow background"
        />
      ) : (
        <ImageWithPlaceholder
          className="fixed inset-0 -z-2 h-dvh w-full"
          imgClassName="object-cover object-center blur-lg backdrop-blur"
          src="/images/home-banner5.png"
          alt="home banner"
        />
      )}
      <div className="fixed inset-0 -z-1 bg-gray-900/80" />

      <div className="z-2 mx-auto w-[min(92vw,1000px)]">
        {/* 앨범으로 돌아가기 버튼 */}
        <Button
          variant="icon"
          size="md"
          className="mb-10 pl-10 text-sm text-plum-200"
          onClick={() => navigate(`/album/${albumId}`)}
        >
          <ArrowLeftIcon className="size-5 text-plum-100" />
        </Button>
        <SongDetailViewer />
      </div>
    </div>
  );
};

export default SongDetail;
