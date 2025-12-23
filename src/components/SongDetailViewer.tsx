import Button from "@/components/Button";
import CommentInput, { type CommentData } from "@/components/CommentInput";
import CommentList, { type CommentListRef } from "@/components/CommentList";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbumsSupabase } from "@/hooks/supabase/useAlbumsSupabase";
import { useSongSupabase } from "@/hooks/supabase/useSongSupabase";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // Handle various YouTube URL formats
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

const SongDetailViewer: FC = () => {
  const { albumId, songId } = useParams();
  const { detailView, isLoading, error } = useSongSupabase(albumId, songId);
  const { albumsView } = useAlbumsSupabase();
  const [showLyrics, setShowLyrics] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const commentListRef = useRef<CommentListRef>(null);

  const album = useMemo(
    () => albumsView.find((a) => String(a.id) === albumId),
    [albumsView, albumId],
  );

  const youtubeId = useMemo(
    () => (detailView?.videoUrl ? extractYouTubeId(detailView.videoUrl) : null),
    [detailView?.videoUrl],
  );

  const handleCommentSubmit = (newComment: CommentData) => {
    commentListRef.current?.addComment(newComment);
  };

  if (isLoading) {
    return (
      <div className="text-bold text-center text-plum-300/80">
        로로로로디중...
      </div>
    );
  }
  if (error) {
    return (
      <p className="text-red-200 text-center">
        Failed to load song detail
        {error.message}
      </p>
    );
  }
  if (!detailView) {
    return null;
  }

  return (
    <div className="mx-auto mb-20 w-[min(92vw,1000px)] px-5 md:px-0">
      {/* 상단: 앨범 커버 + 제목 & 소개 */}
      <div className="mb-5 flex flex-col items-center gap-6 md:justify-center md:gap-10 lg:flex-row">
        {/* 앨범 커버 (노래 이미지 우선, 없으면 앨범 커버) */}
        <ImageWithPlaceholder
          className="ld:h-[350px] ld:w-[350px] h-[250px] w-[250px] shrink-0 shadow-[0_15px_35px_rgba(0,0,0,0.35)] md:h-[320px] md:w-[320px]"
          imgClassName="h-full w-full object-cover"
          src={
            detailView.imgUrl || album?.coverUrl || "/images/placeholder.png"
          }
          alt="album cover"
        />

        {/* 제목 & 소개 */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-10 flex items-center gap-5">
            <h2 className="text-2xl font-bold text-plum-200 md:text-4xl">
              {detailView.title}
            </h2>
            {youtubeId && (
              <Button
                variant="icon"
                size="sm"
                onClick={() => setShowPlayer(!showPlayer)}
                className="mb-1 h-6.5 w-6.5 rounded-full bg-plum-600 hover:bg-plum-500 md:h-8.5 md:w-8.5"
              >
                {showPlayer ? (
                  <PauseIcon className="size-5 text-plum-100" />
                ) : (
                  <PlayIcon className="size-5 text-plum-100" />
                )}
              </Button>
            )}
          </div>
          {detailView.description && (
            <p className="md:text-md max-w-[50ch] text-sm leading-loose whitespace-pre-wrap text-plum-200/90 italic">
              {detailView.description}
            </p>
          )}
        </div>
      </div>

      {/* 하단: 가사 토글 */}
      {detailView.lyrics && (
        <div className="flex flex-col items-start">
          <Button
            variant="icon"
            size="sm"
            onClick={() => setShowLyrics(!showLyrics)}
            className="mb-4 pl-10 text-sm text-plum-200"
          >
            {showLyrics ? "▲ 가사" : "▼ 가사"}
          </Button>

          <div
            ref={lyricsRef}
            className={`ml-10 overflow-hidden text-sm leading-relaxed whitespace-pre-wrap text-plum-200/90 transition-all duration-500 ease-in-out md:text-base ${
              showLyrics ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {detailView.lyrics}
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      {songId && (
        <CommentList
          ref={commentListRef}
          songId={songId}
          className="mt-8 mb-24"
        />
      )}

      {/* 고정 댓글 입력 바 */}
      {songId && (
        <CommentInput
          apiEndpoint={`/api/public/song/${songId}/comment`}
          onCommentSubmit={handleCommentSubmit}
        />
      )}

      {/* YouTube 플레이어 - Safari 호환을 위해 화면에 보이게 표시 */}
      {showPlayer && youtubeId && (
        <div className="fixed right-4 bottom-25 z-50 overflow-hidden rounded-lg shadow-2xl md:rounded-xl">
          <iframe
            className="h-[73px] w-[130px] lg:h-[158px] lg:w-[280px]"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default SongDetailViewer;
