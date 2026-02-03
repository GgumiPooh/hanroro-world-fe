import Button from "@/components/Button";
import CommentInput from "@/components/CommentInput";
import CommentList, { type CommentListRef } from "@/components/CommentList";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useAlbums } from "@/hooks/useAlbums";
import { useSong } from "@/hooks/useSong";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import type { Comment } from "@/types/comment";
import type { Nullable } from "@/types/misc";
import { cn } from "@/utils/styles";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router";

const YOUTUBE_URL_PATTERNS = [
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
];

const SongInfo: FC = () => {
  const { albumId, songId } = useParams();

  const { detailView, isLoading, error } = useSong(songId);
  const { albumsView } = useAlbums();
  const { videoId: currentVideoId, isPlaying, toggle } = useYouTubePlayer();

  const [showLyrics, setShowLyrics] = useState(false);
  const commentListRef = useRef<CommentListRef>(null);

  const album = useMemo(
    () => albumsView.find((albumItem) => String(albumItem.id) === albumId),
    [albumsView, albumId],
  );

  const youtubeId = useMemo(
    () => (detailView?.videoUrl ? extractYouTubeId(detailView.videoUrl) : null),
    [detailView?.videoUrl],
  );

  const isCurrentSongPlaying = youtubeId === currentVideoId && isPlaying;

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
      <div className="mb-5 flex flex-col items-center gap-6 md:justify-center md:gap-10 lg:flex-row">
        <ImageWithPlaceholder
          className="ld:h-[350px] ld:w-[350px] h-[250px] w-[250px] shrink-0 shadow-[0_15px_35px_rgba(0,0,0,0.35)] md:h-[320px] md:w-[320px]"
          imgClassName="h-full w-full object-cover"
          src={
            detailView.imageUrl || album?.coverUrl || "/images/placeholder.png"
          }
          alt="album cover"
        />

        <div className="flex flex-col items-center text-center">
          <div className="mb-10 flex items-center gap-5">
            <h2 className="text-2xl font-bold text-plum-200 md:text-4xl">
              {detailView.title}
            </h2>
            {youtubeId && (
              <Button
                variant="icon"
                size="sm"
                onClick={handleTogglePlay}
                className="mb-1 rounded-full bg-plum-600 hover:bg-plum-500 md:h-8.5 md:w-8.5"
              >
                {isCurrentSongPlaying ? (
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

      {detailView.lyrics && (
        <div className="flex flex-col items-start">
          <Button
            variant="icon"
            size="sm"
            onClick={handleToggleLyrics}
            className="mb-4 pl-10 text-sm text-plum-200"
          >
            {showLyrics ? "▲ 가사" : "▼ 가사"}
          </Button>

          <div
            className={cn(
              "ml-10 overflow-hidden text-sm leading-relaxed whitespace-pre-wrap text-plum-200/90 transition-all duration-500 ease-in-out md:text-base",
              showLyrics ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            {detailView.lyrics}
          </div>
        </div>
      )}

      {songId && (
        <CommentList
          ref={commentListRef}
          songId={songId}
          className="mt-8 mb-24"
        />
      )}

      {songId && (
        <CommentInput
          apiEndpoint={`/api/public/song/${songId}/comment`}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );

  function handleTogglePlay() {
    if (youtubeId) {
      toggle(youtubeId);
    }
  }

  function handleToggleLyrics() {
    setShowLyrics(!showLyrics);
  }

  function handleCommentSubmit(newComment: Comment) {
    commentListRef.current?.addComment(newComment);
  }
};

export default SongInfo;

function extractYouTubeId(url: string): Nullable<string> {
  if (!url) return null;

  return (
    YOUTUBE_URL_PATTERNS.map((pattern) => url.match(pattern)?.[1]).find(
      (videoId) => videoId,
    ) ?? null
  );
}
