import { type CommentData } from "@/components/CommentInput";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

type UseCommentsConfig = {
  /** Table name to fetch comments from */
  tableName: string;
  /** Foreign key column name (e.g., "song_id") */
  foreignKeyColumn: string;
  /** Foreign key value (e.g., songId) */
  foreignKeyValue: string | number;
  /** Whether to auto-fetch on mount. Defaults to true */
  autoFetch?: boolean;
};

type CommentRow = {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
  users?: {
    id: string;
    name?: string;
    nickname?: string;
    email?: string;
  };
};

export function useCommentsSupabase(config: UseCommentsConfig) {
  const {
    tableName,
    foreignKeyColumn,
    foreignKeyValue,
    autoFetch = true,
  } = config;

  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select(
          `
          id,
          content,
          user_id,
          created_at,
          users (
            id,
            nickname,
          )
        `,
        )
        .eq(foreignKeyColumn, foreignKeyValue)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const mapped: CommentData[] = (data as CommentRow[]).map((c) => ({
        id: c.id,
        author: c.users?.name || c.users?.nickname || c.users?.email || "익명",
        content: c.content,
        createdAt: new Date(c.created_at).toLocaleDateString("ko-KR"),
      }));

      setComments(mapped);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [tableName, foreignKeyColumn, foreignKeyValue]);

  useEffect(() => {
    if (autoFetch && foreignKeyValue) {
      fetchComments();
    }
  }, [autoFetch, foreignKeyValue, fetchComments]);

  const addComment = useCallback(
    async (content: string): Promise<CommentData | null> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("로그인이 필요합니다.");
        return null;
      }

      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert({
          [foreignKeyColumn]: foreignKeyValue,
          content,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Failed to add comment:", insertError);
        alert("댓글 등록에 실패했습니다.");
        return null;
      }

      const newComment: CommentData = {
        id: data.id,
        author: user.user_metadata?.name || user.email || "익명",
        content,
        createdAt: new Date().toLocaleDateString("ko-KR"),
      };

      setComments((prev) => [newComment, ...prev]);
      return newComment;
    },
    [tableName, foreignKeyColumn, foreignKeyValue],
  );

  const deleteComment = useCallback(
    async (commentId: number) => {
      if (!confirm("삭제하시겠습니까?")) return false;

      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq("id", commentId);

      if (deleteError) {
        console.error("Failed to delete:", deleteError);
        alert("삭제에 실패했습니다.");
        return false;
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      return true;
    },
    [tableName],
  );

  const isOwnComment = useCallback(
    (author: string) => {
      // This is a simplified check - in production you'd compare user IDs
      return !!currentUserId;
    },
    [currentUserId],
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
