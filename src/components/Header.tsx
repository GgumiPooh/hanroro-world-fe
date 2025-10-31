import LogoIcon from "@/icons/LogoIcon";
import { cn } from "@/utils/styles";
import { type FC } from "react";
import Button from "./Button";

type Props = {
  className?: string;
};

const Header: FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex h-20 items-center gap-10 rounded-4xl bg-plum-700/20 p-8 px-5 backdrop-blur-sm",
        className,
      )}
    >
      <LogoIcon className="m-8 w-25 text-plum-300" />
      <Button variant="ghost" size="lg" className="p-3 font-bold">
        TimeLine
      </Button>
      <Button variant="ghost" size="lg" className="p-3 font-bold">
        Album
      </Button>
      <Button variant="ghost" size="lg" className="p-3 font-bold">
        Goods
      </Button>
      <Button variant="ghost" size="lg" className="p-3 font-bold">
        To Artist
      </Button>
    </div>
  );
};

export default Header;
