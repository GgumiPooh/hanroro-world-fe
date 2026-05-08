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
  "모자",
  "긴머리",
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
      <h1 className="mb-15 text-center text-5xl font-bold text-[#faf8e1] md:mb-30 md:text-8xl">
        Gallery
      </h1>

      <div className="z-2 mx-auto w-[min(90vw,760px)] overflow-x-hidden">
        <SearchBar className="mx-3 mb-6" onSearch={handleSearch} />

        <div className="mb-6 scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          {RECOMMENDED_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                selectedTag === tag
                  ? "bg-[#b9b9b978] text-[#e5e2e2]"
                  : "bg-gray-700/50 text-gray-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {isLoading && galleries.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-[#c4bda8] border-t-transparent" />
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

            <div ref={observerRef} className="flex justify-center py-10">
              {isLoading && (
                <div className="size-6 animate-spin rounded-full border-2 border-[#c4bda8] border-t-transparent" />
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

      <Button
        variant="ghost"
        size="lg"
        onClick={handleAddPost}
        className="fixed right-10 bottom-10 z-50 flex rounded-full bg-[#dbd8c286] p-4 ring-3 ring-[#cfcfcf78]"
      >
        <PlusIcon className="size-7 text-white" />
      </Button>

      {isPostOverlayOpen && (
        <GalleryPostOverlay
          onClose={() => setIsPostOverlayOpen(false)}
          onSuccess={handlePostSuccess}
        />
      )}

      {selectedGalleryId !== null && (
        <GalleryDetailOverlay
          galleryId={selectedGalleryId}
          onClose={() => {
            setSelectedGalleryId(null);
            refresh();
          }}
        />
      )}
    </div>
  );
};

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

      <div className="p-3">
        <h3 className="mb-1 truncate text-sm font-medium text-plum-100">
          {gallery.title}
        </h3>
        <p className="mb-2 text-xs text-gray-400">{gallery.authorName}</p>

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
