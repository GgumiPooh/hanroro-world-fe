import Button from "@/components/Button";
import { DESKTOP_MENU_LIST } from "@/constants/navigation";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import LogoIcon from "@/icons/LogoIcon";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { cn } from "@/utils/styles";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState, type FC } from "react";

type Props = {
  className?: string;
};

const Header: FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  useBreakpoint("lg", (isMatch) => {
    if (!isMatch) {
      return;
    }

    setIsOpen(false);
  });

  return (
    <div
      className={cn(
        "space-y-5 rounded-4xl bg-plum-700/20 px-6 py-5 backdrop-blur-sm md:py-4",
        "transition-[max-height] duration-800",
        !isOpen && "max-h-20",
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
          <DesktopMenuList className="not-lg:hidden" />
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
          "transition-opacity",
          isOpen && "duration-1000",
          !isOpen && "pointer-events-none opacity-0 duration-500",
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
          <MobileMenuPanel />
        )}
      </div>
    </div>
  );

  function handleToggleMenu() {
    setIsOpen((prev) => !prev);
  }
};

const DesktopMenuList: FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <ul className={cn("flex items-center", className)}>
      {DESKTOP_MENU_LIST.map((item) => (
        <li key={item.href} className="mr-7">
          <Button
            variant="ghost"
            size="md"
            className="font-bold"
            onClick={() => {
              window.location.href = item.href;
            }}
          >
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
};

const MobileMenuPanel: FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <ul className={cn("", className)}>
      {DESKTOP_MENU_LIST.map((item) => (
        <li key={item.href} className="mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="font-bold"
            onClick={() => {
              window.location.href = item.href;
            }}
          >
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default Header;
