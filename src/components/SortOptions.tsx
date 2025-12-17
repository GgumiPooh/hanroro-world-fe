import Button from "@/components/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { Sort } from "@/types/sort";
import { cn } from "@/utils/styles";
import { type FC } from "react";

type Props = {
  className?: string;
  sort: Sort;
  onChange: (sort: Sort) => void;
};

const SortOptions: FC<Props> = ({ className, sort, onChange }) => {
  const isSmallBreakpoint = useBreakpoint("sm");
  return (
    <div className={cn("flex gap-10 font-bold", className)}>
      <Button
        variant="ghost"
        size={isSmallBreakpoint ? "md" : "sm"}
        onClick={() => onChange("latest")}
        className={cn("cursor-default text-plum-300 ring-1 ring-plum-300")}
      >
        최신순
      </Button>
      <Button
        variant="ghost"
        size={isSmallBreakpoint ? "md" : "sm"}
        onClick={() => onChange("oldest")}
        className={cn("cursor-default text-plum-300 ring-1 ring-plum-300")}
      >
        오래된순
      </Button>
    </div>
  );
};

export default SortOptions;
