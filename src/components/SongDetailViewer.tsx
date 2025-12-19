import Button from "@/components/Button";
import CommentInput from "@/components/CommentInput";
import CommentList, { type CommentListRef } from "@/components/CommentList";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbums } from "@/hooks/useAlbums";
import { useSong } from "@/hooks/useSong";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router";

const SongDetailViewer: FC = () => {
  const { albumId, songId } = useParams();
  const { detailView, isLoading, error } = useSong(albumId, songId);
  const { albumsView } = useAlbums();
  const [showLyrics, setShowLyrics] = useState(false);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const commentListRef = useRef<CommentListRef>(null);

  const album = useMemo(
    () => albumsView.find((a) => String(a.id) === albumId),
    [albumsView, albumId],
  );

  const handleCommentSubmit = (newComment: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
  }) => {
    commentListRef.current?.addComment(newComment);
  };

  if (isLoading) {
    return <p className="text-center text-plum-100/80">Loading...</p>;
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
      <div className="mb-5 flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
        {/* 앨범 커버 */}
        <ImageWithPlaceholder
          className="h-[260px] w-[260px] shrink-0 shadow-[0_15px_35px_rgba(0,0,0,0.35)] md:h-[320px] md:w-[320px]"
          imgClassName="h-full w-full object-cover"
          src={album?.coverUrl || "/images/placeholder.png"}
          alt="album cover"
        />

        {/* 제목 & 소개 */}
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-5 text-2xl font-bold text-plum-200 md:text-4xl">
            {detailView.title}
          </h2>
          {detailView.description && (
            <p className="max-w-[50ch] text-sm leading-loose whitespace-pre-wrap text-plum-200/90 italic md:text-lg">
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
            className={`ml-10 overflow-hidden leading-relaxed whitespace-pre-wrap text-plum-200/90 transition-all duration-500 ease-in-out ${
              showLyrics ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {detailView.lyrics}
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      {songId && <CommentList ref={commentListRef} songId={songId} />}

      {/* 고정 댓글 입력 바 */}
      <CommentInput
        apiEndpoint={`/api/public/song/${songId}/comment`}
        onCommentSubmit={handleCommentSubmit}
      />
    </div>
  );
};

export default SongDetailViewer;
