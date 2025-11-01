import { BREAKPOINTS } from "@/constants/viewport";
import type { ViewportBreakpoint } from "@/types/viewport";
import { useEffect } from "react";
import { useMedia } from "react-use";

export function useBreakpoint(
  breakpoint: ViewportBreakpoint,
  callback?: (isMatch: boolean) => void,
) {
  const isMatch = useMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`, true);

  useEffect(() => {
    callback?.(isMatch);
  }, [isMatch, callback]);

  return isMatch;
}
