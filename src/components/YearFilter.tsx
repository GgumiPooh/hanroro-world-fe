import { cn } from "@/utils/styles";
import type { FC } from "react";
import { useMemo } from "react";

type Props = {
  className?: string;
  year: string;
  onChange: (year: string) => void;
};

const YearFilter: FC<Props> = ({ className, year, onChange }) => {
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const start = 2023;
    const list: string[] = [];
    for (let y = current; y >= start; y--) {
      list.push(String(y));
    }
    return list;
  }, []);

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <select
        className={cn(
          "rounded-2xl bg-plum-500/60 px-3 py-2 text-sm text-plum-100",
          "ring-1 ring-plum-300/30 transition outline-none",
        )}
        value={year}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">전체</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <label className="mr-20 text-plum-200">년도</label>
    </div>
  );
};

export default YearFilter;
