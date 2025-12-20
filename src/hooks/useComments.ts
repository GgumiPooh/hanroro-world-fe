import { type CommentData } from "@/components/CommentInput";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useCallback, useEffect, useState } from "react";

type UseCommentsConfig = {
  fetchEndpoint: string;
  deleteEndpoint: (id: number) => string;
  /** Whether to auto-fetch on mount. Defaults to true */
  autoFetch?: boolean;
};

type ApiResponse = {
  id: number;
  comment?: string;
  message?: string;
  author: string;
  createdAt: string;
};

export function useComments(config: UseCommentsConfig) {
  const { fetchEndpoint, deleteEndpoint, autoFetch = true } = config;
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      const data = (await res.json()) as ApiResponse[];

      const mapped: CommentData[] = data.map((c) => ({
        id: c.id,
        author: c.author,
        content: c.comment ?? c.message ?? "",
        createdAt: c.createdAt,
      }));

      setComments(mapped);
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

  const addComment = useCallback((newComment: CommentData) => {
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

        setComments((prev) => prev.filter((c) => c.id !== commentId));
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
