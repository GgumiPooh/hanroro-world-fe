import AlbumDetailViewer from "@/components/AlbumDetailViewer";
import BlurBackground from "@/components/BlurBackground";
import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbumsSupabase } from "@/hooks/supabase/useAlbumsSupabase";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

const AlbumDetail: FC = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { albumsView } = useAlbumsSupabase();
  const [showDescription, setShowDescription] = useState(false);

  const album = useMemo(
    () => albumsView.find((a) => String(a.id) === albumId),
    [albumsView, albumId],
  );

  return (
    <div className="relative overflow-y-auto pt-30 md:pt-50">
      {/* Glow background from album cover (fallback to default banner) */}
      {album?.coverUrl ? (
        <ImageWithPlaceholder
          className="fixed inset-0 -z-2 h-dvh w-full"
          imgClassName="h-full w-full scale-110 object-cover blur-lg saturate-150 backdrop-blur"
          src={album.coverUrl}
          alt="album glow background"
        />
      ) : (
        <BlurBackground />
      )}
      <div className="fixed inset-0 -z-1 bg-gray-900/80" />

      <div className="z-2 mx-auto w-[min(92vw,900px)]">
        {/* 앨범 커버 + 제목 */}
        {album?.coverUrl && (
          <div className="relative mx-5 mb-10">
            <Button
              variant="icon"
              size="md"
              className="mb-10 text-sm text-plum-200"
              onClick={() => navigate("/albums")}
            >
              <ArrowLeftIcon className="size-5 text-plum-100" />
            </Button>
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-end lg:gap-20">
              <ImageWithPlaceholder
                src={album.coverUrl}
                alt={album.titleText || "Album cover"}
                className="h-60 w-60 shrink-0 object-cover shadow-lg sm:h-70 sm:w-70 md:h-75 md:w-75 lg:h-85 lg:w-85"
              />
              <div className="flex flex-col items-center gap-2 md:items-start">
                <div className="text-2xl font-bold text-plum-100 sm:text-3xl md:text-4xl">
                  {album.titleText}
                </div>
                {/* 토글 버튼 */}
                <Button
                  variant="icon"
                  size="sm"
                  onClick={() => setShowDescription(!showDescription)}
                  className="ml-6 self-start p-0 text-plum-300 md:ml-0"
                >
                  {showDescription ? (
                    <span className="text-bold">▲</span>
                  ) : (
                    <span className="text-bold">▼ 앨범소개</span>
                  )}
                </Button>
                {/* 토글 시 설명 표시 */}
                <div
                  className={`overflow-hidden text-xs whitespace-pre-wrap text-plum-200/80 transition-all duration-400 ease-in-out md:text-base ${showDescription ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {album.descriptionText}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 곡 목록 - 앨범 커버 아래 */}
        <div className="mx-5 mb-10 text-sm md:text-base">
          {albumId && <AlbumDetailViewer albumId={albumId} />}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;
