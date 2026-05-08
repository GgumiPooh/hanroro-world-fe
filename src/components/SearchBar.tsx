import Button from "@/components/Button";
import { cn } from "@/utils/styles";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, type FC } from "react";

type Props = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
};

const SearchBar: FC<Props> = ({
  placeholder = "검색어를 입력하세요...",
  onSearch,
  className,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch?.(query.trim());
  };

  return (
    <div className={cn("flex w-full items-center gap-3 px-4", className)}>
      <MagnifyingGlassIcon className="size-5 shrink-0 text-[#c4bda8]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder={placeholder}
        className="h-8 min-w-0 flex-1 rounded-2xl border border-[#ffffff76] bg-[#b9b7b410] px-4 text-sm text-[#e5e2e2] placeholder-[#838382b9] outline-none focus:border-[#c4bda8] disabled:opacity-50 md:h-9 md:text-base"
      />
      <Button
        variant="icon"
        size="sm"
        onClick={handleSearch}
        className="md:h-9 h-8 shrink-0 border border-gray-300/30 bg-[#b9b9b978] px-4 text-sm font-medium text-gray-300 transition-colors hover:border-plum-400/50"
      >
        검색
      </Button>
    </div>
  );
};

export default SearchBar;
