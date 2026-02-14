import Button from "@/components/Button";
import CommentInput from "@/components/CommentInput";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import { ENV_VARIABLE } from "@/utils/env-variable";
import {
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState, type FC } from "react";

type GalleryDetail = {
  id: number;
  title: string;
  description: string;
  authorId: number;
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
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const { user, displayName } = useCurrentUser();
  const { open: openLogin } = useAuthOverlay();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user && gallery && String(user.id) === String(gallery.authorId);

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

  // 배경 스크롤 방지
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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

  const handleCommentSubmit = (comment: {
    id: number;
    content: string;
    author?: string;
    authorName?: string;
    createdAt: string;
  }) => {
    setGallery((prev) =>
      prev
        ? {
            ...prev,
            comments: [
              {
                id: comment.id,
                content: comment.content,
                authorName: comment.authorName || comment.author || "익명",
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

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleDownloadCurrent = () => {
    if (gallery) {
      const filename = `${gallery.title}_${currentImageIndex + 1}.jpg`;
      downloadImage(gallery.imageUrls[currentImageIndex], filename);
    }
    setShowDownloadMenu(false);
  };

  const handleDownloadAll = async () => {
    if (gallery) {
      for (let i = 0; i < gallery.imageUrls.length; i++) {
        const filename = `${gallery.title}_${i + 1}.jpg`;
        await downloadImage(gallery.imageUrls[i], filename);
        // 각 다운로드 사이에 약간의 지연 추가
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
    setShowDownloadMenu(false);
  };

  const handleDelete = async () => {
    if (!gallery) return;

    const confirmed = window.confirm("이 게시물을 삭제하시겠습니까?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}/api/public/gallery/${galleryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("게시물이 삭제되었습니다.");
        onClose();
        window.location.reload(); // 목록 새로고침
      } else {
        const error = await res.text();
        alert(`삭제 실패: ${error}`);
      }
    } catch (err) {
      console.error("Failed to delete gallery:", err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
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
    <div
      className="fixed inset-0 z-60 flex items-center justify-center px-2 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative scrollbar-hide flex h-[95vh] w-[min(92vw,900px)] flex-col overflow-y-auto rounded-2xl bg-black/90 pt-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 버튼들 */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {/* 삭제 버튼 (작성자만 표시) */}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-red-500/70 p-2 text-white transition-colors hover:bg-red-600/90 disabled:opacity-50"
              title="삭제"
            >
              <TrashIcon className="size-4 md:size-6" />
            </button>
          )}

          {/* 다운로드 버튼 */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <ArrowDownTrayIcon className="size-4 md:size-6" />
            </button>

            {/* 다운로드 메뉴 */}
            {showDownloadMenu && (
              <div className="absolute top-full right-0 mt-2 w-40 overflow-hidden rounded-xl bg-gray-800/95 shadow-lg backdrop-blur-sm">
                <button
                  onClick={handleDownloadCurrent}
                  className="w-full px-4 py-3 text-left text-sm text-white transition-colors hover:bg-gray-700/50"
                >
                  이 사진만 저장
                </button>
                {gallery && gallery.imageUrls.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="w-full border-t border-gray-700 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-gray-700/50"
                  >
                    전체 사진 저장 ({gallery.imageUrls.length}장)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <XMarkIcon className="size-4 md:size-6" />
          </button>
        </div>
        {/* 이미지 네비게이션 버튼 */}
        {gallery.imageUrls.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-3/7 left-0 mx-3 -translate-y-1/2 rounded-full border border-gray-700/60 bg-black/50 p-2 text-white transition-colors"
            >
              <ChevronLeftIcon className="size-4 md:size-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-3/7 right-0 mx-3 -translate-y-1/2 rounded-full border border-gray-700/60 bg-black/50 p-2 text-white transition-colors"
            >
              <ChevronRightIcon className="size-4 md:size-6" />
            </button>
          </>
        )}

        {/* 이미지 슬라이더 */}
        <div className="relative mx-auto flex w-[90%] shrink-0 flex-col items-center justify-center p-5">
          {/* 이미지 */}
          <img
            src={gallery.imageUrls[currentImageIndex]}
            alt={gallery.title}
            className="max-h-[60vh] max-w-full object-contain"
          />

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
          <div className="border-b border-gray-700/60 p-4 md:p-6">
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
                {gallery.isLikedByMe && user ? (
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
          <div className="mb-15 p-4 md:p-6">
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
          <div className=" bottom-0 z-50 w-full p-3 md:p-4">
            <CommentInput
              apiEndpoint={`/api/public/gallery/${galleryId}/comments`}
              onCommentSubmit={handleCommentSubmit}
              placeholder="댓글을 입력하세요..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetailOverlay;
