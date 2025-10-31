import LogoIcon from "@/icons/LogoIcon";
import { cn } from "@/utils/styles";
import { type FC } from "react";

type Props = {
  className?: string;
};

const Header: FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex h-20 items-center rounded-3xl border p-8 px-5",
        className,
      )}
    >
      <LogoIcon className="w-40 text-green-600" />
    </div>
  );
};

export default Header;
