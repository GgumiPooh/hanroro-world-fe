import AuthOverlayProvider from "@/providers/AuthOverlayProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import YouTubePlayerProvider from "@/providers/YouTubePlayerProvider";
import type { FC, PropsWithChildren } from "react";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TanstackQueryProvider>
      <YouTubePlayerProvider>
        <AuthOverlayProvider>{children}</AuthOverlayProvider>
      </YouTubePlayerProvider>
    </TanstackQueryProvider>
  );
};

export default RootProvider;
