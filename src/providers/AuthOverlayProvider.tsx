import LoginOverlay from "@/components/LoginOverlay";
import type { Nullable } from "@/types/misc";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

type AuthOverlayContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AuthOverlayContext =
  createContext<Nullable<AuthOverlayContextValue>>(null);

export const useAuthOverlay = (): AuthOverlayContextValue => {
  const context = useContext(AuthOverlayContext);
  if (!context) {
    throw new Error("useAuthOverlay must be used within AuthOverlayProvider");
  }
  return context;
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
