import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbums } from "@/hooks/useAlbums";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSong } from "@/hooks/useSong";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router";

const SongDetailViewer: FC = () => {
  const { albumId, songId } = useParams();
  const { detailView, isLoading, error } = useSong(albumId, songId);
  const { albumsView } = useAlbums();
  const { user } = useCurrentUser();
  const { open: openLogin } = useAuthOverlay();
  const [comment, setComment] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<
    { id: number; author: string; content: string; createdAt: string }[]
  >([
    // TODO: Replace with API fetch
    {
      id: 1,
      author: "로로팬",
      content: "이 노래 너무 좋아요 💜",
      createdAt: "2024.12.19",
    },
    {
      id: 2,
      author: "한로로사랑",
      content: "가사가 정말 감동적이에요",
      createdAt: "2024.12.18",
    },
  ]);

  const album = useMemo(
    () => albumsView.find((a) => String(a.id) === albumId),
    [albumsView, albumId],
  );

  const handleInputFocus = () => {
    if (!user) {
      openLogin();
    }
  };

  const handleSubmitComment = () => {
    if (!user) {
      openLogin();
      return;
    }
    if (!comment.trim()) return;
    // TODO: API call to submit comment
    const newComment = {
      id: Date.now(),
      author: user.name || user.nickname || "익명",
      content: comment.trim(),
      createdAt: new Date()
        .toLocaleDateString("ko-KR")
        .replaceAll(". ", ".")
        .replace(".", ""),
    };
    setComments((prev) => [newComment, ...prev]);
    setComment("");
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
      <section className="mt-8 mb-24">
        <h3 className="mb-4 text-lg font-semibold text-plum-100">
          댓글 <span className="text-plum-400">({comments.length})</span>
        </h3>
        {comments.length === 0 ? (
          <p className="text-center text-sm text-plum-300/60">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-plum-700/20 bg-plum-900/30 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-plum-200">{c.author}</span>
                  <span className="text-xs text-plum-400/60">
                    {c.createdAt}
                  </span>
                </div>
                <p className="text-sm text-plum-100/90">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 고정 댓글 입력 바 */}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <div className="flex w-[min(92vw,1000px)] items-center gap-3 rounded-2xl bg-plum-900/50 px-4 py-3 backdrop-blur-md">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            onFocus={handleInputFocus}
            placeholder="댓글을 입력하세요..."
            className="flex-1 rounded-xl border border-gray-500/30 bg-gray-500/30 px-4 py-3 text-sm text-plum-100 placeholder-plum-400/60 transition-colors outline-none hover:border-plum-400 focus:border-plum-400 md:text-base"
          />
          <Button
            variant="icon"
            size="sm"
            onClick={handleSubmitComment}
            className="h-11 w-11 shrink-0 rounded-xl bg-plum-600 hover:bg-plum-500"
          >
            <PaperAirplaneIcon className="size-5 text-plum-100" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SongDetailViewer;
