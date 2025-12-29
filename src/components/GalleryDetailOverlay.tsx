import Button from "@/components/Button";
import CommentInput, { type CommentData } from "@/components/CommentInput";
import { useCurrentUser } from "@/hooks/backend";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import { ENV_VARIABLE } from "@/utils/env-variable";
import {
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState, type FC } from "react";

type GalleryDetail = {
  id: number;
  title: string;
  description: string;
  authorName: string;
  imageUrls: string[];
  likeCount: number;
  viewCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  comments: Comment[];
  createdAt: string;
};

type Comment = {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
};

type Props = {
  galleryId: number;
  onClose: () => void;
};

const GalleryDetailOverlay: FC<Props> = ({ galleryId, onClose }) => {
  const [gallery, setGallery] = useState<GalleryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { displayName } = useCurrentUser();
  const { open: openLogin } = useAuthOverlay();

  const fetchGallery = useCallback(async () => {
    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}/api/public/gallery/${galleryId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
      }
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setIsLoading(false);
    }
  }, [galleryId]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleLike = async () => {
    if (!displayName) {
      openLogin();
      return;
    }

    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(
        `${baseUrl}/api/public/gallery/${galleryId}/like`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (res.ok) {
        const data = await res.json();
        setGallery((prev) =>
          prev
            ? {
                ...prev,
                isLikedByMe: data.liked,
                likeCount: data.likeCount,
              }
            : null,
        );
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleCommentSubmit = (comment: CommentData) => {
    setGallery((prev) =>
      prev
        ? {
            ...prev,
            comments: [
              {
                id: comment.id,
                content: comment.content,
                authorName: comment.author,
                createdAt: comment.createdAt,
              },
              ...prev.comments,
            ],
            commentCount: prev.commentCount + 1,
          }
        : null,
    );
  };

  const handlePrevImage = () => {
    if (gallery) {
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : gallery.imageUrls.length - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (gallery) {
      setCurrentImageIndex((prev) =>
        prev < gallery.imageUrls.length - 1 ? prev + 1 : 0,
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="size-10 animate-spin rounded-full border-2 border-plum-400 border-t-transparent" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-center text-gray-400">
          <p>게시물을 찾을 수 없습니다.</p>
          <Button variant="ghost" size="md" onClick={onClose} className="mt-4">
            닫기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-10 backdrop-blur-sm">
      <div className="relative scrollbar-hide flex h-[85vh] w-[min(100vw,1300px)] flex-col overflow-y-auto rounded-2xl bg-black/50">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-1 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        >
          <XMarkIcon className="size-6" />
        </button>

        {/* 이미지 슬라이더 */}
        <div className="relative mx-auto flex h-3/4 w-3/4 shrink-0 flex-col items-center justify-center pt-20 md:w-4/7">
          {/* 이미지 */}
          <img
            src={gallery.imageUrls[currentImageIndex]}
            alt={gallery.title}
            className="max-h-[60vh] max-w-full object-contain"
          />

          {/* 이미지 네비게이션 버튼 */}
          {gallery.imageUrls.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </>
          )}

          {/* 이미지 인디케이터 - 이미지 아래에 자연스럽게 배치 */}
          {gallery.imageUrls.length > 1 && (
            <div className="mt-4 flex gap-2">
              {gallery.imageUrls.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`size-2 rounded-full transition-colors ${
                    idx === currentImageIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 정보 및 댓글 */}
        <div className="relative scrollbar-hide flex w-full flex-col">
          {/* 헤더 */}
          <div className="border-b border-gray-700/60 p-6">
            <h2 className="text-2xl font-bold text-white">{gallery.title}</h2>
            <p className="mt-2 text-sm text-gray-400">
              by {gallery.authorName} · {formatDate(gallery.createdAt)}
            </p>
            {gallery.description && (
              <p className="mt-3 text-gray-300">{gallery.description}</p>
            )}

            {/* 좋아요/댓글 */}
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-400 transition-colors hover:text-plum-400"
              >
                {gallery.isLikedByMe ? (
                  <HeartIconSolid className="text-red-500 size-6" />
                ) : (
                  <HeartIcon className="size-6" />
                )}
                <span>{gallery.likeCount}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-400">
                <ChatBubbleLeftIcon className="size-6" />
                <span>{gallery.commentCount}</span>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="flex-1 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">댓글</h3>

            {gallery.comments.length === 0 ? (
              <p className="text-center text-gray-500">아직 댓글이 없습니다.</p>
            ) : (
              <div className="mb-24 space-y-4">
                {gallery.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl bg-gray-900/40 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-plum-300">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 댓글 입력 */}
          <div className="sticky bottom-0 z-50 bg-gray-900/60 p-4 backdrop-blur-sm">
            <CommentInput
              apiEndpoint={`/api/public/gallery/${galleryId}/comments`}
              onCommentSubmit={handleCommentSubmit}
              placeholder="댓글을 입력하세요..."
              inline
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetailOverlay;
