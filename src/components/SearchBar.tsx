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
    <div
      className={cn(
        "flex items-center gap-3 rounded-4xl bg-gray-500/50 px-4 py-3 backdrop-blur-md",
        className,
      )}
    >
      <MagnifyingGlassIcon className="size-5 shrink-0 text-plum-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder={placeholder}
        className="h-10 flex-1 rounded-2xl border border-gray-500/30 bg-plum-500/20 px-4 text-sm text-plum-100 placeholder-plum-400/50 outline-none hover:border-plum-400 focus:border-plum-400 md:text-base"
      />
      <Button
        variant="icon"
        size="sm"
        onClick={handleSearch}
        className="h-10 shrink-0 rounded-3xl border border-gray-500/30 bg-plum-900/30 px-4 text-sm font-medium text-gray-300 transition-colors"
      >
        검색
      </Button>
    </div>
  );
};

export default SearchBar;
