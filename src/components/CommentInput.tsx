import Button from "@/components/Button";
import { useCurrentUser } from "@/hooks/backend/useCurrentUser";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useState } from "react";

export type CommentData = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

type Props = {
  apiEndpoint: string;
  onCommentSubmit?: (comment: CommentData) => void;
  placeholder?: string;
  className?: string;
};

const CommentInput: FC<Props> = ({
  apiEndpoint,
  onCommentSubmit,
  placeholder = "댓글을 입력하세요...",
  className,
}) => {
  const { displayName } = useCurrentUser();
  const { open: openLogin } = useAuthOverlay();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputFocus = () => {
    if (!displayName) {
      openLogin();
    }
  };

  const handleSubmit = async () => {
    if (!displayName) {
      openLogin();
      return;
    }
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: comment.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit comment");
      }

      // 백엔드 응답에서 실제 댓글 데이터 사용 (실제 ID 포함)
      const savedData = (await res.json()) as {
        id: number;
        comment: string;
        author: string;
        createdAt: string;
      };

      const newComment: CommentData = {
        id: savedData.id,
        author: savedData.author,
        content: savedData.comment,
        createdAt: savedData.createdAt,
      };

      onCommentSubmit?.(newComment);
      setComment("");
    } catch (err) {
      console.error("Comment submission failed:", err);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 ${className ?? ""}`}
    >
      <div className="flex w-[min(92vw,1000px)] items-center gap-3 rounded-2xl bg-gray-800/50 px-4 py-3 backdrop-blur-md">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="h-11 flex-1 rounded-xl border border-plum-500/30 bg-plum-100/10 px-3 text-sm text-plum-100 placeholder-plum-400/50 transition-colors outline-none placeholder:text-xs hover:border-plum-400 focus:border-plum-400 disabled:opacity-50 md:text-base"
        />
        <Button
          variant="icon"
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="hover:plum-400 h-11 w-11 shrink-0 rounded-xl border border-plum-500/30 bg-plum-300/10 hover:bg-plum-400/30 disabled:opacity-50"
        >
          <PaperAirplaneIcon className="size-5 text-plum-300 hover:text-plum-100" />
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
