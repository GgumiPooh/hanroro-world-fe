import Button from "@/components/Button";
import { type CommentData } from "@/components/CommentInput";
import { supabase } from "@/lib/supabase";
import { useCurrentUserSupabase } from "@/hooks/supabase/useCurrentUserSupabase";
import { useAuthOverlay } from "@/providers/AuthOverlayProvider";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { useState } from "react";

type Props = {
  tableName: string;
  foreignKeyColumn: string;
  foreignKeyValue: string | number;
  onCommentSubmit?: (comment: CommentData) => void;
  placeholder?: string;
  className?: string;
};

const CommentInputSupabase: FC<Props> = ({
  tableName,
  foreignKeyColumn,
  foreignKeyValue,
  onCommentSubmit,
  placeholder = "댓글을 입력하세요...",
  className,
}) => {
  const { user } = useCurrentUserSupabase();
  const { open: openLogin } = useAuthOverlay();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputFocus = () => {
    if (!user) {
      openLogin();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          [foreignKeyColumn]: foreignKeyValue,
          content: comment.trim(),
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const newComment: CommentData = {
        id: data.id,
        author: user.name || user.nickname || user.email || "익명",
        content: comment.trim(),
        createdAt: new Date().toLocaleDateString("ko-KR"),
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
      <div className="flex w-[min(92vw,600px)] items-center gap-3 rounded-2xl border border-plum-700/30 bg-plum-900/90 px-4 py-3 backdrop-blur-md">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-gray-500/30 bg-gray-500/30 px-4 py-3 text-sm text-plum-100 placeholder-plum-400/60 outline-none transition-colors hover:border-plum-400 focus:border-plum-400 disabled:opacity-50 md:text-base"
        />
        <Button
          variant="icon"
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-11 w-11 shrink-0 rounded-xl bg-plum-600 hover:bg-plum-500 disabled:opacity-50"
        >
          <PaperAirplaneIcon className="size-5 text-plum-100" />
        </Button>
      </div>
    </div>
  );
};

export default CommentInputSupabase;

