import AuthOverlayProvider from "@/providers/AuthOverlayProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import type { FC, PropsWithChildren } from "react";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TanstackQueryProvider>
      <AuthOverlayProvider>{children}</AuthOverlayProvider>
    </TanstackQueryProvider>
  );
};

export default RootProvider;
