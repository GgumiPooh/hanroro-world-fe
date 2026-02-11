import Button from "@/components/Button";
import GalleryDetailOverlay from "@/components/GalleryDetailOverlay";
import GalleryPostOverlay from "@/components/GalleryPostOverlay";
import SearchBar from "@/components/SearchBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGalleries, type GalleryItem } from "@/hooks/useGalleries";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import {
  ChatBubbleLeftIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState, type FC } from "react";

const RECOMMENDED_TAGS = [
  "전체",
  "안경",
  "단발",
  "굿즈",
  "콘서트",
  "일상",
  "화보",
  "뮤비",
  "인스타",
];

const Gallery: FC = () => {
  const [selectedTag, setSelectedTag] = useState("전체");
  const [isPostOverlayOpen, setIsPostOverlayOpen] = useState(false);
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(
    null,
  );

  const { displayName } = useCurrentUser();
  const { open: openLogin } = useAuthOverlay();

  const { galleries, isLoading, error, hasMore, loadMore, search, refresh } =
    useGalleries();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      search(query);
    } else {
      refresh();
    }
  };

  const handleAddPost = () => {
    if (!displayName) {
      openLogin();
      return;
    }
    setIsPostOverlayOpen(true);
  };

  const handlePostSuccess = () => {
    refresh();
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "전체") {
      refresh();
    } else {
      search(tag);
    }
  };

  // 무한 스크롤
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="relative scrollbar-hide h-dvh overflow-y-auto bg-black pt-50">
      <h1 className="mb-15 text-center text-5xl font-bold text-gray-100 md:mb-30 md:text-8xl">
        Gallery
      </h1>

      {/* 왼쪽 고정 추천 검색어 메뉴 */}
      {/* <aside className="fixed top-70 left-10 z-40 hidden w-35 lg:block">
        <div className="rounded-2xl border border-gray-300/30 p-4">
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
                      ? "bg-plum-300/30 text-plum-100"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                  }`}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside> */}

      {/* 메인 콘텐츠 */}
      <div className="z-2 mx-auto w-[min(92vw,760px)]">
        <SearchBar className="mb-6" onSearch={handleSearch} />

        {/* 모바일용 태그 가로 스크롤 */}
        <div className="mb-6 scrollbar-hide flex gap-2 overflow-x-auto pb-2">
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

        {/* 갤러리 그리드 */}
        {isLoading && galleries.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-plum-400 border-t-transparent" />
          </div>
        ) : error ? (
          <p className="text-center text-gray-400">{error}</p>
        ) : galleries.length === 0 ? (
          <p className="py-20 text-center text-gray-400">
            아직 게시물이 없습니다.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 pb-20 md:grid-cols-3">
              {galleries.map((gallery) => (
                <GalleryCard
                  key={gallery.id}
                  gallery={gallery}
                  onClick={() => setSelectedGalleryId(gallery.id)}
                />
              ))}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={observerRef} className="flex justify-center py-10">
              {isLoading && (
                <div className="size-6 animate-spin rounded-full border-2 border-plum-400 border-t-transparent" />
              )}
              {!hasMore && galleries.length > 0 && (
                <p className="text-sm text-gray-500">
                  모든 게시물을 불러왔습니다
                </p>
              )}
            </div>
          </>
        )}
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
          onSuccess={handlePostSuccess}
        />
      )}

      {/* 게시물 상세보기 오버레이 */}
      {selectedGalleryId !== null && (
        <GalleryDetailOverlay
          galleryId={selectedGalleryId}
          onClose={() => setSelectedGalleryId(null)}
        />
      )}
    </div>
  );
};

// 갤러리 카드 컴포넌트
type GalleryCardProps = {
  gallery: GalleryItem;
  onClick: () => void;
};

const GalleryCard: FC<GalleryCardProps> = ({ gallery, onClick }) => {
  const thumbnailUrl = gallery.imageUrls[0] || "";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden transition-transform"
    >
      {/* 썸네일 */}
      <div className="aspect-3/4 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={gallery.title}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gray-700">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-3">
        <h3 className="mb-1 truncate text-sm font-medium text-plum-100">
          {gallery.title}
        </h3>
        <p className="mb-2 text-xs text-gray-400">{gallery.authorName}</p>

        {/* 좋아요 & 댓글 & 조회수 */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <HeartIcon className="size-3.5" />
            {gallery.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <ChatBubbleLeftIcon className="size-3.5" />
            {gallery.commentCount}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon className="size-3.5" />
            {gallery.viewCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
