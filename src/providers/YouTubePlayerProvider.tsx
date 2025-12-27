import Button from "@/components/Button";
import type { Nullable } from "@/types/misc";
import {
  createContext,
  useCallback,
  useMemo,
  useRef,
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
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const play = useCallback((videoId: string) => {
    // iOS Safari: 클릭 이벤트 내에서 동기적으로 iframe src 설정
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1`;
    }
    setPlayerState({ videoId, isPlaying: true });
  }, []);

  const pause = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = "";
    }
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
    () => ({ ...playerState, play, pause, stop, toggle, iframeRef }),
    [playerState, play, pause, stop, toggle],
  );

  return (
    <YouTubePlayerContext.Provider value={contextValue}>
      {children}
      <GlobalYouTubePlayer
        isVisible={playerState.isPlaying && !!playerState.videoId}
        iframeRef={iframeRef}
        onClose={stop}
      />
    </YouTubePlayerContext.Provider>
  );
};

type GlobalPlayerProps = {
  isVisible: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onClose: () => void;
};

const GlobalYouTubePlayer: FC<GlobalPlayerProps> = ({
  isVisible,
  iframeRef,
  onClose,
}) => {
  return (
    <div
      className={`fixed right-4 bottom-25 z-50 overflow-hidden rounded-xl shadow-2xl transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
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
        ref={iframeRef}
        className="h-[120px] w-[213px] md:h-[158px] md:w-[280px]"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubePlayerProvider;
