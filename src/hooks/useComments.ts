import { useCurrentUser } from "@/hooks/useCurrentUser";
import { commentArraySchema } from "@/schemas/comment";
import type { Comment } from "@/types/comment";
import type { Nullable } from "@/types/misc";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useCallback, useEffect, useState } from "react";

type UseCommentsConfig = {
  fetchEndpoint: string;
  deleteEndpoint: (id: number) => string;
  autoFetch?: boolean;
};

export function useComments(config: UseCommentsConfig) {
  const { fetchEndpoint, deleteEndpoint, autoFetch = true } = config;
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Nullable<string>>(null);
  const { displayName } = useCurrentUser();

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}${fetchEndpoint}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data: unknown = await res.json();
      const validated = commentArraySchema.parse(data);

      setComments(validated);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchEndpoint]);

  useEffect(() => {
    if (autoFetch) {
      fetchComments();
    }
  }, [autoFetch, fetchComments]);

  const addComment = useCallback((newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  }, []);

  const deleteComment = useCallback(
    async (commentId: number) => {
      if (!confirm("삭제하시겠습니까?")) return false;

      try {
        const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}${deleteEndpoint(commentId)}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to delete");
        }

        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId),
        );
        return true;
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("삭제에 실패했습니다.");
        return false;
      }
    },
    [deleteEndpoint],
  );

  const isOwnComment = useCallback(
    (author: string) => displayName && author === displayName,
    [displayName],
  );

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    isOwnComment,
    refresh: fetchComments,
  };
}
