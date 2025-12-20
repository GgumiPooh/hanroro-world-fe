import Button from "@/components/Button";
import NicknameChangeOverlay from "@/components/NicknameChangeOverlay";
import UserMenuOverlay from "@/components/UserMenuOverlay";
import { DESKTOP_MENU_LIST } from "@/constants/navigation";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LogoIcon from "@/icons/LogoIcon";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { cn } from "@/utils/styles";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState, type FC } from "react";

type Props = {
  className?: string;
};

const Header: FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const { displayName, isLoading: isUserLoading } = useCurrentUser();
  const headerRef = useRef<HTMLDivElement | null>(null);

  useBreakpoint("lg", (isMatch) => {
    if (!isMatch) {
      return;
    }

    setIsOpen(false);
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handleDocumentClick(event: MouseEvent) {
      const root = headerRef.current;
      if (!root) return;
      const target = event.target as Node | null;
      if (target && !root.contains(target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isOpen]);

  return (
    <div
      ref={headerRef}
      className={cn(
        "rounded-4xl bg-plum-600/40 px-6 py-3 backdrop-blur-sm",
        "transition-[max-height] duration-800",
        isOpen && "max-h-[1000px]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Button
          variant="icon"
          size="sm"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <LogoIcon className="w-20 shrink-0 text-plum-200 md:w-25" />
        </Button>
        {ENV_VARIABLE.IS_COMMING_SOON ? (
          <Button
            variant="ghost"
            size="md"
            className="font-bold not-lg:hidden"
            onClick={() => window.alert("Comming soon")}
          >
            Comming soon
          </Button>
        ) : (
          <DesktopMenuList
            className="hidden lg:flex"
            displayName={displayName}
            isLoading={isUserLoading}
            onUserClick={() => setIsUserMenuOpen(true)}
          />
        )}
        <Button
          variant="icon"
          size="sm"
          className="lg:hidden"
          onClick={handleToggleMenu}
        >
          <Bars3Icon className="size-10 stroke-2 text-plum-200" />
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-700 ease-in-out",
          "lg:hidden",
          isOpen
            ? "max-h-[600px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        {ENV_VARIABLE.IS_COMMING_SOON ? (
          <Button
            variant="ghost"
            size="md"
            className="font-bold"
            onClick={() => window.alert("Comming soon")}
          >
            Comming soon
          </Button>
        ) : (
          <MobileMenuPanel
            className="mt-5 ml-1"
            displayName={displayName}
            isLoading={isUserLoading}
            onUserClick={() => setIsUserMenuOpen(true)}
          />
        )}
      </div>

      {/* 유저 메뉴 모달 */}
      {isUserMenuOpen && (
        <UserMenuOverlay
          onClose={() => setIsUserMenuOpen(false)}
          onNicknameChange={() => setIsNicknameModalOpen(true)}
        />
      )}

      {/* 닉네임 변경 모달 */}
      {isNicknameModalOpen && (
        <NicknameChangeOverlay
          currentNickname={displayName}
          onClose={() => setIsNicknameModalOpen(false)}
        />
      )}
    </div>
  );

  function handleToggleMenu() {
    setIsOpen((prev) => !prev);
  }
};

const DesktopMenuList: FC<{
  className?: string;
  displayName?: string | null;
  isLoading?: boolean;
  onUserClick?: () => void;
}> = ({ className, displayName, isLoading, onUserClick }) => {
  const { open } = useAuthOverlay();

  const getLoginLabel = () => {
    if (isLoading) return "...";
    if (displayName) return displayName + " 님!";
    return "Log In";
  };

  return (
    <ul className={cn("flex items-center", className)}>
      {DESKTOP_MENU_LIST.map((item) => (
        <li key={item.href} className="mr-7">
          <Button
            variant="ghost"
            size="md"
            className="font-bold"
            onClick={() => {
              if (item.href === "/login") {
                if (isLoading) return;
                if (displayName) {
                  onUserClick?.();
                  return;
                }
                open();
                return;
              }
              window.location.href = item.href;
            }}
          >
            {item.href === "/login" ? getLoginLabel() : item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
};

const MobileMenuPanel: FC<{
  className?: string;
  displayName?: string | null;
  isLoading?: boolean;
  onUserClick?: () => void;
}> = ({ className, displayName, isLoading, onUserClick }) => {
  const { open } = useAuthOverlay();

  const getLoginLabel = () => {
    if (isLoading) return "...";
    if (displayName) return displayName + " 님!";
    return "Log In";
  };

  return (
    <ul className={cn("", className)}>
      {DESKTOP_MENU_LIST.map((item) => (
        <li key={item.href} className="mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="font-bold"
            onClick={() => {
              if (item.href === "/login") {
                if (isLoading) return;
                if (displayName) {
                  onUserClick?.();
                  return;
                }
                open();
                return;
              }
              window.location.href = item.href;
            }}
          >
            {item.href === "/login" ? getLoginLabel() : item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default Header;
