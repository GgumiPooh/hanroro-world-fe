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
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <label className="font-bold text-plum-100">년도</label>
    </div>
  );
};

export default YearFilter;
