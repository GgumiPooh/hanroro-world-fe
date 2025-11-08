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
    <div className={cn("flex gap-10 font-bold", className)}>
      <Button
        variant="secondary"
        size="md"
        onClick={() => onChage("latest")}
        className={cn(
          "font-bold",
          sort === "latest" &&
            "cursor-default bg-plum-600/50 text-plum-300 hover:!scale-100 hover:!bg-plum-600/50 hover:!text-plum-300 hover:!ring-0 focus:!ring-0 active:!scale-100 active:!bg-plum-600/50",
        )}
      >
        latest
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={() => onChage("oldest")}
        className={cn(
          sort === "oldest" &&
            // 기본(비-hover) 상태를 명시하고, hover/active/focus를 모두 무력화
            "cursor-default bg-plum-600/50 text-plum-300 hover:!scale-100 hover:!bg-plum-600/50 hover:!text-plum-300 hover:!ring-0 focus:!ring-0 active:!scale-100 active:!bg-plum-600/50",
        )}
      >
        oldest
      </Button>
    </div>
  );
};

export default SortOptions;
