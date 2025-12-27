import Button from "@/components/Button";
import type { Nullable } from "@/types/misc";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

type PlayerState = {
  videoId: Nullable<string>;
  isPlaying: boolean;
};

type PlayerActions = {
  play: (videoId: string) => void;
  pause: () => void;
  stop: () => void;
  toggle: (videoId: string) => void;
};

type YouTubePlayerContextValue = PlayerState & PlayerActions;

export const YouTubePlayerContext =
  createContext<Nullable<YouTubePlayerContextValue>>(null);

const INITIAL_STATE: PlayerState = {
  videoId: null,
  isPlaying: false,
};

const YouTubePlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_STATE);

  const play = useCallback((videoId: string) => {
    setPlayerState({ videoId, isPlaying: true });
  }, []);

  const pause = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    setPlayerState(INITIAL_STATE);
  }, []);

  const toggle = useCallback(
    (videoId: string) => {
      const isSameVideo = playerState.videoId === videoId;
      if (isSameVideo && playerState.isPlaying) {
        stop();
      } else {
        play(videoId);
      }
    },
    [playerState.videoId, playerState.isPlaying, play, stop],
  );

  const contextValue = useMemo(
    () => ({ ...playerState, play, pause, stop, toggle }),
    [playerState, play, pause, stop, toggle],
  );

  return (
    <YouTubePlayerContext.Provider value={contextValue}>
      {children}
      {playerState.videoId && playerState.isPlaying && (
        <GlobalYouTubePlayer videoId={playerState.videoId} onClose={stop} />
      )}
    </YouTubePlayerContext.Provider>
  );
};

type GlobalPlayerProps = {
  videoId: string;
  onClose: () => void;
};

const GlobalYouTubePlayer: FC<GlobalPlayerProps> = ({ videoId, onClose }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1`;

  return (
    <div className="fixed right-4 bottom-25 z-50 overflow-hidden rounded-xl shadow-2xl">
      <Button
        variant="icon"
        size="sm"
        onClick={onClose}
        aria-label="플레이어 닫기"
        className="absolute top-0 right-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/80 text-xs text-white"
      >
        ✕
      </Button>
      <iframe
        className="h-[110px] w-[196px] md:h-[158px] md:w-[280px] lg:h-[202px] lg:w-[360px]"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubePlayerProvider;
