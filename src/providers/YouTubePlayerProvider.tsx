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

  const toggle = useCallback((videoId: string) => {
    setPlayerState((prev) => {
      const isSameVideo = prev.videoId === videoId;
      if (isSameVideo) {
        return { ...prev, isPlaying: !prev.isPlaying };
      }
      return { videoId, isPlaying: true };
    });
  }, []);

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

const GlobalYouTubePlayer: FC<{ videoId: string; onClose: () => void }> = ({
  videoId,
  onClose,
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;

  return (
    <div className="fixed right-4 bottom-25 z-50 overflow-hidden rounded-lg shadow-2xl md:rounded-xl">
      <Button
        variant="icon"
        size="sm"
        onClick={onClose}
        aria-label="플레이어 닫기"
        className="absolute -right-0 z-10 size-2 rounded-full bg-gray-800/50 p-2 text-gray-300"
      >
        ✕
      </Button>
      <iframe
        className="h-[73px] w-[130px] lg:h-[158px] lg:w-[280px]"
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
