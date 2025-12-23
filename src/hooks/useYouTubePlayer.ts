import { YouTubePlayerContext } from "@/providers/YouTubePlayerProvider";
import { assert } from "@/utils/assert";
import { useContext } from "react";

export function useYouTubePlayer() {
  const context = useContext(YouTubePlayerContext);

  assert(context, "useYouTubePlayer must be used within YouTubePlayerProvider");

  return context;
}
