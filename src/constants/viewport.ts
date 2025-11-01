import type { ViewportBreakpoint } from "@/types/viewport";

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} satisfies Record<ViewportBreakpoint, number>;
