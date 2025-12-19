import Button from "@/components/Button";
import { type CommentData } from "@/components/CommentInput";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type Props = {
  songId: string | number;
};

export type CommentListRef = {
  addComment: (comment: CommentData) => void;
  refresh: () => void;
};

const CommentList = forwardRef<CommentListRef, Props>(({ songId }, ref) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { displayName } = useCurrentUser();

  const isOwnComment = (author: string) => {
    return displayName && author === displayName;
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(
        `${baseUrl}/api/public/song/comment/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      console.log(res);
      if (!res.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const fetchComments = useCallback(async () => {
    if (!songId) return;

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}/api/public/song/${songId}/comments`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = (await res.json()) as {
        id: number;
        comment: string;
        author: string;
        createdAt: string;
      }[];

      const mapped: CommentData[] = data.map((c) => ({
        id: c.id,
        author: c.author,
        content: c.comment,
        createdAt: c.createdAt,
      }));

      setComments(mapped);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [songId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback((newComment: CommentData) => {
    setComments((prev) => [newComment, ...prev]);
  }, []);

  useImperativeHandle(ref, () => ({
    addComment,
    refresh: fetchComments,
  }));

  if (isLoading) {
    return (
      <section className="mt-8 mb-24">
        <p className="text-center text-sm text-plum-300/60">댓글 로딩중...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 mb-24">
        <p className="text-red-300/80 text-center text-sm">{error}</p>
      </section>
    );
  }

  return (
    <section className="mt-8 mb-24">
      <h3 className="mb-4 text-lg font-semibold text-plum-100">
        댓글 <span className="text-plum-400">({comments.length})</span>
      </h3>
      {comments.length === 0 ? (
        <p className="text-center text-sm text-plum-300/60">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const isOwn = isOwnComment(c.author);
            return (
              <li
                key={c.id}
                className="rounded-xl border border-plum-700/20 bg-plum-900/30 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${isOwn ? "text-plum-500" : "text-plum-200"}`}
                    >
                      {c.author}
                    </span>
                    <span className="text-xs text-plum-400/60">
                      {c.createdAt}
                    </span>
                  </div>
                  {isOwn && (
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => handleDelete(c.id)}
                      className="hover:text-red-400/80 h-8 w-8 text-plum-400"
                    >
                      <XMarkIcon className="size-5 text-plum-100" />
                    </Button>
                  )}
                </div>
                <p className="text-md font-medium text-plum-100/90">
                  {c.content}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
});

CommentList.displayName = "CommentList";

export default CommentList;
