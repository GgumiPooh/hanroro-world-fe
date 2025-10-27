import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import type { FC, PropsWithChildren } from "react";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  return <TanstackQueryProvider>{children}</TanstackQueryProvider>;
};

export default RootProvider;
