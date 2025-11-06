import Button from "@/components/Button";
import type { Sort } from "@/types/sort";
import { cn } from "@/utils/styles";
import { type FC } from "react";

type Props = {
  className?: string;
  sort: Sort;
  onChage: (sort: Sort) => void;
};

const SortOptions: FC<Props> = ({ className, sort, onChage }) => {
  return (
    <div className={cn("mb-30 ml-130 flex gap-10", className)}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChage("latest")}
        className={cn(
          sort === "latest" &&
            "cursor-default bg-plum-600/50 text-plum-300 hover:!scale-100 hover:!bg-plum-600/50 hover:!text-plum-300 hover:!ring-0 focus:!ring-0 active:!scale-100 active:!bg-plum-600/50",
        )}
      >
        최신순
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChage("oldest")}
        // className={cn(sort === "oldest" && "disabled")}
        className={cn(
          sort === "oldest" &&
            // 기본(비-hover) 상태를 명시하고, hover/active/focus를 모두 무력화
            "cursor-default bg-plum-600/50 text-plum-300 hover:!scale-100 hover:!bg-plum-600/50 hover:!text-plum-300 hover:!ring-0 focus:!ring-0 active:!scale-100 active:!bg-plum-600/50",
        )}
      >
        오래된순
      </Button>
    </div>
  );
};

export default SortOptions;
