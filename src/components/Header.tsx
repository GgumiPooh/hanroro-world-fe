import Button from "@/components/Button";
import NicknameChangeOverlay from "@/components/NicknameChangeOverlay";
import UserMenuOverlay from "@/components/UserMenuOverlay";
import { DESKTOP_MENU_LIST } from "@/constants/navigation";
import { useCurrentUser } from "@/hooks/backend/useCurrentUser";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import LogoIcon from "@/icons/LogoIcon";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOverlayOpen, setIsUserOverlayOpen] = useState(false);
  const [isNicknameOverlayOpen, setIsNicknameOverlayOpen] = useState(false);
  const { displayName, isLoading: isUserLoading } = useCurrentUser();
  const headerRef = useRef<HTMLDivElement | null>(null);

  useClickAway(headerRef, () => {
    setIsOpen(false);
  });

  useBreakpoint("lg", (isMatch) => {
    if (!isMatch) {
      return;
    }

    setIsOpen(false);
  });

  return (
    <>
      <div
        ref={headerRef}
        className={cn(
          "rounded-4xl bg-gray-600/40 px-6 py-3 backdrop-blur-sm",
          "transition-[max-height] duration-800",
          isOpen && "max-h-[1000px]",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="icon" size="sm" onClick={handleToggleMenu(false)}>
              <LogoIcon className="w-20 shrink-0 text-plum-100 md:w-25" />
            </Button>
          </Link>
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
              onUserClick={() => setIsUserOverlayOpen(true)}
            />
          )}
          <Button
            variant="icon"
            size="sm"
            className="lg:hidden"
            onClick={handleToggleMenu(!isOpen)}
          >
            <Bars3Icon className="size-10 stroke-2 text-plum-100" />
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
              onUserClick={() => setIsUserOverlayOpen(true)}
              onNavigate={handleToggleMenu(false)}
            />
          )}
        </div>
      </div>

      {isUserOverlayOpen && (
        <UserMenuOverlay
          onClose={() => setIsUserOverlayOpen(false)}
          onNicknameChange={() => setIsNicknameOverlayOpen(true)}
        />
      )}

      {isNicknameOverlayOpen && (
        <NicknameChangeOverlay
          currentNickname={displayName}
          onClose={() => setIsNicknameOverlayOpen(false)}
        />
      )}
    </>
  );

  function handleToggleMenu(isOpen: boolean) {
    return () => {
      setIsOpen(isOpen);
    };
  }
};

type MenuListProps = {
  className?: string;
  displayName?: string | null;
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

  const getLoginLabel = () => {
    if (isLoading) return ". . .";
    if (displayName) return displayName + " 님!";
    return "Log In";
  };

  return (
    <ul className={cn("flex items-center", className)}>
      {DESKTOP_MENU_LIST.map((item) => (
        <li key={item.href} className="mr-7">
          <Button
            className="font-bold"
            variant="ghost"
            size="md"
            disabled={isLoading}
            onClick={() => {
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
              return;
            }}
          >
            {item.href === "/login" ? getLoginLabel() : item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
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

  const getLoginLabel = () => {
    if (displayName) return displayName + " 님!";
    return "Log In";
  };

  return (
    <ul className={cn("", className)}>
      {DESKTOP_MENU_LIST.map((item) => (
        <li key={item.href} className="mb-3">
          <Button
            className="text-base font-bold"
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={() => {
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
              return;
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
