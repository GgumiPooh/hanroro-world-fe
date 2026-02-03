import Button from "@/components/Button";
import NicknameChangeOverlay from "@/components/NicknameChangeOverlay";
import UserMenuOverlay from "@/components/UserMenuOverlay";
import { HEADER_MENU_LIST } from "@/constants/navigation";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LogoIcon from "@/icons/LogoIcon";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import type { Nullable } from "@/types/misc";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { cn } from "@/utils/styles";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useRef, useState, type FC } from "react";
import { Link, useNavigate } from "react-router";
import { useClickAway } from "react-use";

type Props = {
  className?: string;
};

const Header: FC<Props> = ({ className }) => {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isUserOverlayOpen, setIsUserOverlayOpen] = useState(false);
  const [isNicknameOverlayOpen, setIsNicknameOverlayOpen] = useState(false);

  const { displayName, isLoading: isUserLoading } = useCurrentUser();

  const headerRef = useRef<Nullable<HTMLDivElement>>(null);

  useClickAway(headerRef, () => {
    setIsHeaderMenuOpen(false);
  });

  useBreakpoint("lg", (isMatch) => {
    if (!isMatch) {
      return;
    }

    setIsHeaderMenuOpen(false);
  });

  return (
    <>
      <div
        ref={headerRef}
        className={cn(
          "rounded-4xl bg-gray-600/40 px-3 py-1.5 backdrop-blur-sm md:px-6",
          "transition-[max-height] duration-800",
          isHeaderMenuOpen && "max-h-[1000px]",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button
              variant="icon"
              size="sm"
              onClick={handleToggleHeaderMenu(false)}
            >
              <LogoIcon className="w-18 shrink-0 pt-0.5 text-plum-100 md:w-25" />
            </Button>
          </Link>
          {ENV_VARIABLE.IS_COMMING_SOON ? (
            <Button
              className="font-bold not-lg:hidden"
              variant="ghost"
              size="md"
              onClick={() => window.alert("Comming soon")}
            >
              Comming soon
            </Button>
          ) : (
            <DesktopMenuList
              className="hidden lg:flex"
              displayName={displayName}
              isLoading={isUserLoading}
              onUserClick={() => setIsUserOverlayOpen(true)}
            />
          )}
          <Button
            className="lg:hidden"
            variant="icon"
            size="sm"
            onClick={handleToggleHeaderMenu()}
          >
            <Bars3Icon className="size-9 stroke-2 text-plum-100" />
          </Button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-700 ease-in-out",
            "lg:hidden",
            isHeaderMenuOpen
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
              onUserClick={() => setIsUserOverlayOpen(true)}
              onNavigate={handleToggleHeaderMenu(false)}
            />
          )}
        </div>
      </div>

      {isUserOverlayOpen && (
        <UserMenuOverlay
          onClose={handleToggleUserOverlay(false)}
          onNicknameMenuClick={handleToggleNicknameOverlay(true)}
        />
      )}

      {isNicknameOverlayOpen && (
        <NicknameChangeOverlay
          currentNickname={displayName}
          onClose={handleToggleNicknameOverlay(false)}
        />
      )}
    </>
  );

  function handleToggleHeaderMenu(isOpen?: boolean) {
    return () => setIsHeaderMenuOpen((prev) => isOpen ?? !prev);
  }

  function handleToggleUserOverlay(isOpen?: boolean) {
    return () => setIsUserOverlayOpen((prev) => isOpen ?? !prev);
  }

  function handleToggleNicknameOverlay(isOpen?: boolean) {
    return () => setIsNicknameOverlayOpen((prev) => isOpen ?? !prev);
  }
};

type MenuListProps = {
  className?: string;
  displayName?: Nullable<string>;
  isLoading?: boolean;
  onUserClick?: () => void;
  onNavigate?: () => void;
};

const DesktopMenuList: FC<MenuListProps> = ({
  className,
  displayName,
  isLoading,
  onUserClick,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const { open: openAuthOverlay } = useAuthOverlay();

  return (
    <ul className={cn("flex items-center", className)}>
      {HEADER_MENU_LIST.map((item) => (
        <li key={item.href} className="mr-7">
          <Button
            className="font-bold"
            variant="ghost"
            size="md"
            onClick={handleMenuClick(item)}
          >
            {item.href === "/login" ? getLoginLabel() : item.label}
          </Button>
        </li>
      ))}
    </ul>
  );

  function handleMenuClick(item: (typeof HEADER_MENU_LIST)[number]) {
    return () => {
      onNavigate?.();

      if (item.href !== "/login") {
        navigate(item.href);
        return;
      }

      if (displayName) {
        onUserClick?.();
        return;
      }

      openAuthOverlay();
    };
  }

  function getLoginLabel() {
    if (isLoading) return ". . .";
    if (displayName) return displayName + " 님!";
    return "Log In";
  }
};

const MobileMenuPanel: FC<MenuListProps> = ({
  className,
  displayName,
  isLoading,
  onUserClick,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const { open: openAuthOverlay } = useAuthOverlay();

  return (
    <ul className={cn("", className)}>
      {HEADER_MENU_LIST.map((item) => (
        <li key={item.href} className="mb-3">
          <Button
            className="text-base font-bold"
            variant="ghost"
            size="sm"
            onClick={handleMenuClick(item)}
          >
            {item.href === "/login" ? getLoginLabel() : item.label}
          </Button>
        </li>
      ))}
    </ul>
  );

  function handleMenuClick(item: (typeof HEADER_MENU_LIST)[number]) {
    return () => {
      onNavigate?.();

      if (item.href !== "/login") {
        navigate(item.href);
        return;
      }

      if (displayName) {
        onUserClick?.();
        return;
      }

      openAuthOverlay();
    };
  }

  function getLoginLabel() {
    if (isLoading) return ". . .";
    if (displayName) return displayName + " 님!";
    return "Log In";
  }
};

export default Header;
