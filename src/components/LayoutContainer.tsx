import { cn } from "@/utils/styles";
import { type FC, type PropsWithChildren } from "react";

type Props = {
  className?: string;
} & PropsWithChildren;

const LayoutContainer: FC<Props> = ({ className, children }) => {
  return (
    <div className={cn("mx-auto max-w-[1920px] px-5", className)}>
      {children}
    </div>
  );
};

export default LayoutContainer;
