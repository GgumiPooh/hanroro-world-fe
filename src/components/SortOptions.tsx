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
    <div className={cn("flex gap-2 text-nowrap sm:gap-8", className)}>
      <Button
        className={cn(
          "w-full cursor-default font-bold ring-1 sm:w-auto",
          sort === "latest"
            ? "text-plum-100 ring-plum-300"
            : "bg-black/10 text-plum-200 ring-black/10",
        )}
        variant="ghost"
        size={isSmallBreakpoint ? "md" : "sm"}
        onClick={handleSortLatest}
      >
        최신순
      </Button>
      <Button
        className={cn(
          "w-full cursor-default font-bold ring-1 sm:w-auto",
          sort === "oldest"
            ? "text-plum-100 ring-plum-300"
            : "bg-black/10 text-plum-200 ring-black/10",
        )}
        variant="ghost"
        size={isSmallBreakpoint ? "md" : "sm"}
        onClick={handleSortOldest}
      >
        오래된순
      </Button>
    </div>
  );

  function handleSortLatest() {
    onChange("latest");
  }

  function handleSortOldest() {
    onChange("oldest");
  }
};

export default SortOptions;
