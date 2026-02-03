import { EARLIEST_ACTIVITY_YEAR } from "@/constants/misc";
import { cn } from "@/utils/styles";
import type { FC } from "react";
import { useMemo } from "react";

type Props = {
  className?: string;
  year: string;
  onChange: (year: string) => void;
};

const YearFilter: FC<Props> = ({ className, year, onChange }) => {
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearCount = currentYear - EARLIEST_ACTIVITY_YEAR + 1;

    return Array.from({ length: yearCount }, (_, index) =>
      String(currentYear - index),
    );
  }, []);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <select
        className={cn(
          "rounded-2xl bg-plum-200/20 p-1 text-plum-100 md:p-2",
          "transition outline-none",
        )}
        value={year}
        onChange={(e) => onChange(e.target.value)}
      >
        <option className="font-bold" value="">
          전체
        </option>
        {yearOptions.map((yearValue) => (
          <option key={yearValue} value={yearValue}>
            {yearValue}
          </option>
        ))}
      </select>
      <label className="font-bold text-plum-100">년도</label>
    </div>
  );
};

export default YearFilter;
