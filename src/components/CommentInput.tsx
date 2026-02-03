import Button from "@/components/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import { commentSchema } from "@/schemas/comment";
import type { Comment } from "@/types/comment";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useState } from "react";

type Props = {
  apiEndpoint: string;
  onCommentSubmit?: (comment: Comment) => void;
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
          onMouseDown={handleInputClick}
          placeholder={
            displayName ? placeholder : "로그인 후 댓글을 작성할 수 있습니다!"
          }
          disabled={isSubmitting}
          readOnly={!displayName}
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

  function handleInputClick(e: React.MouseEvent) {
    if (!displayName) {
      e.preventDefault();
      openLogin();
    }
  }

  async function handleSubmit() {
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
        body: JSON.stringify({ content: comment.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit comment");
      }

      const responseData: unknown = await res.json();
      const newComment = commentSchema.parse(responseData);

      onCommentSubmit?.(newComment);
      setComment("");
    } catch (err) {
      console.error("Comment submission failed:", err);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }
};

export default CommentInput;
