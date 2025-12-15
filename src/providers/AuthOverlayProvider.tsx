import LoginOverlay from "@/components/LoginOverlay";
import { createContext, useCallback, useContext, useState, type FC, type PropsWithChildren } from "react";

type AuthOverlayContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AuthOverlayContext = createContext<AuthOverlayContextValue | null>(null);

export const useAuthOverlay = (): AuthOverlayContextValue => {
  const ctx = useContext(AuthOverlayContext);
  if (!ctx) {
    throw new Error("useAuthOverlay must be used within AuthOverlayProvider");
  }
  return ctx;
};

const AuthOverlayProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AuthOverlayContext.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && <LoginOverlay onClose={close} />}
    </AuthOverlayContext.Provider>
  );
};

export default AuthOverlayProvider;


