import LogoIcon from "@/icons/LogoIcon";
import { cn } from "@/utils/styles";
import { type FC } from "react";

type Props = {
  className?: string;
};

const Header: FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex h-20 items-center bg-green-500/60", className)}>
      <LogoIcon className="w-30" />
    </div>
  );
};

export default Header;
