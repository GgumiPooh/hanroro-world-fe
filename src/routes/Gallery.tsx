import Button from "@/components/Button";
import GalleryPostOverlay from "@/components/GalleryPostOverlay";
import SearchBar from "@/components/SearchBar";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState, type FC } from "react";

const RECOMMENDED_TAGS = [
  "전체",
  "안경",
  "굿즈",
  "콘서트",
  "일상",
  "밈",
  "커버",
  "브이로그",
];

const Gallery: FC = () => {
  const [selectedTag, setSelectedTag] = useState("전체");
  const [isPostOverlayOpen, setIsPostOverlayOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log("검색:", query);
    // TODO: 검색 로직 구현
  };

  const handleAddPost = () => {
    setIsPostOverlayOpen(true);
  };

  const handlePostSubmit = (data: { title: string; images: File[] }) => {
    console.log("게시물 작성:", data);
    // TODO: 백엔드 API 호출
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    console.log("태그 선택:", tag);
    // TODO: 태그 필터링 로직 구현
  };

  return (
    <div className="relative h-dvh overflow-y-auto bg-gray-900 pt-50">
      <h1 className="mb-15 text-center text-5xl font-bold text-gray-100 md:mb-20 md:text-8xl">
        Gallery
      </h1>

      {/* 왼쪽 고정 추천 검색어 메뉴 */}
      <aside className="fixed top-70 left-10 z-40 hidden w-48 md:block">
        <div className="rounded-2xl bg-gray-800/50 p-4 backdrop-blur-md">
          <h2 className="mb-4 text-sm font-semibold text-plum-300">
            추천 태그
          </h2>
          <ul className="space-y-1">
            {RECOMMENDED_TAGS.map((tag) => (
              <li key={tag}>
                <button
                  onClick={() => handleTagClick(tag)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    selectedTag === tag
                      ? "bg-plum-500/40 text-plum-100"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                  }`}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="z-2 mx-auto w-[min(92vw,760px)] px-4">
        <SearchBar className="mb-10" onSearch={handleSearch} />

        {/* 모바일용 태그 가로 스크롤 */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden">
          {RECOMMENDED_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                selectedTag === tag
                  ? "bg-plum-500/40 text-plum-100"
                  : "bg-gray-700/50 text-gray-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* TODO: GalleryView 컴포넌트 추가 예정 */}
        <p className="text-center text-gray-300">Coming soon...</p>
      </div>

      {/* 플로팅 추가 버튼 */}
      <Button
        variant="ghost"
        size="lg"
        onClick={handleAddPost}
        className="fixed right-10 bottom-10 z-50 flex rounded-full bg-plum-300/50 p-4 ring-3 ring-gray-500/30"
      >
        <PlusIcon className="size-7 text-white" />
      </Button>

      {/* 게시물 작성 오버레이 */}
      {isPostOverlayOpen && (
        <GalleryPostOverlay
          onClose={() => setIsPostOverlayOpen(false)}
          onSubmit={handlePostSubmit}
        />
      )}
    </div>
  );
};

export default Gallery;
