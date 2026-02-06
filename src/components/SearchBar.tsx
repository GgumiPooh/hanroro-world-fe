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
    <div className={cn("flex items-center gap-3", className)}>
      <MagnifyingGlassIcon className="size-5 shrink-0 text-plum-300" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder={placeholder}
        className="h-8 flex-1 rounded-2xl border border-gray-300/30 bg-gray-500/20 px-4 text-sm text-plum-300 placeholder-plum-300/80 outline-none focus:border-plum-400/50 md:h-10 md:text-base"
      />
      <Button
        variant="icon"
        size="sm"
        onClick={handleSearch}
        className="h-9 shrink-0 rounded-3xl border border-gray-300/30 bg-plum-500/30 px-4 text-sm font-medium text-gray-300 transition-colors hover:border-plum-400/50"
      >
        검색
      </Button>
    </div>
  );
};

export default SearchBar;
