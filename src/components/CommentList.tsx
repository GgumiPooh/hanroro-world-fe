import Button from "@/components/Button";
import { useComments } from "@/hooks/useComments";
import type { Comment } from "@/types/comment";
import { cn } from "@/utils/styles";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Ref } from "react";
import { useImperativeHandle } from "react";

export type CommentListHandle = {
  addComment: (comment: Comment) => void;
  refresh: () => void;
};

type Props = {
  className?: string;
  ref?: Ref<CommentListHandle>;
  songId?: string | number;
  fetchEndpoint?: string;
  showHeader?: boolean;
  emptyMessage?: string;
  deleteEndpoint?: (id: number) => string;
};

const CommentList = ({
  className,
  ref,
  songId,
  fetchEndpoint,
  showHeader = true,
  emptyMessage = "아직 댓글이 없습니다. 첫 댓글을 남겨보세요!",
  deleteEndpoint,
}: Props) => {
  const finalFetchEndpoint =
    fetchEndpoint ?? `/api/public/song/${songId}/comments`;
  const finalDeleteEndpoint =
    deleteEndpoint ?? ((id: number) => `/api/public/song/comment/${id}`);

  const {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    isOwnComment,
    refresh,
  } = useComments({
    fetchEndpoint: finalFetchEndpoint,
    deleteEndpoint: finalDeleteEndpoint,
  });

  useImperativeHandle(ref, () => ({
    addComment,
    refresh,
  }));

  return (
    <section className={className}>
      {isLoading ? (
        <p className="text-center text-sm text-plum-300/60">로딩중...</p>
      ) : error ? (
        <p className="text-center text-sm text-plum-300/80">{error}</p>
      ) : (
        <>
          {showHeader && (
            <h3 className="mb-4 text-lg font-semibold text-plum-100">
              댓글 <span className="text-plum-400">({comments.length})</span>
            </h3>
          )}
          {comments.length === 0 ? (
            <p className="text-center text-sm text-plum-300/60">
              {emptyMessage}
            </p>
          ) : (
            <ul className="mb-50 flex w-full flex-col gap-5">
              {comments.map((commentItem) => {
                const isOwn = isOwnComment(commentItem.author);
                return (
                  <li
                    className={cn(
                      "flex",
                      isOwn ? "justify-end" : "justify-start",
                    )}
                    key={commentItem.id}
                  >
                    <div
                      className={cn(
                        "relative w-full rounded-2xl bg-plum-300/20 px-4 py-3",
                        isOwn ? "rounded-br-none" : "rounded-bl-none",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="md:text-md text-sm text-plum-300">
                            {commentItem.author}
                          </span>
                          <span className="text-xs text-plum-200/90">
                            {commentItem.createdAt}
                          </span>
                        </div>
                        {isOwn && (
                          <Button
                            className="h-8 w-8 text-plum-300 hover:text-red-400/80"
                            variant="icon"
                            size="sm"
                            onClick={() => deleteComment(commentItem.id)}
                          >
                            <XMarkIcon className="size-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-base font-medium leading-relaxed text-plum-300 md:text-lg">
                        {commentItem.content}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
};

export default CommentList;
