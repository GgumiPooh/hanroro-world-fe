import SortOptions from "@/components/SortOptions";
import YearFilter from "@/components/YearFilter";
import type { Sort } from "@/types/sort";
import { cn } from "@/utils/styles";
import type { FC } from "react";

type Props = {
  className?: string;
  year: string;
  sort: Sort;
  onYearChange: (year: string) => void;
  onSortChange: (sort: Sort) => void;
};

const ActivityControls: FC<Props> = ({
  className,
  year,
  sort,
  onYearChange,
  onSortChange,
}) => {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <YearFilter year={year} onChange={onYearChange} />
      <SortOptions sort={sort} onChange={onSortChange} />
    </div>
  );
};

export default ActivityControls;
