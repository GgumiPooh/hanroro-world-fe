import Button from "@/components/Button";
import { type CommentData } from "@/components/CommentInput";
import { useComments } from "@/hooks/useComments";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { forwardRef, useImperativeHandle } from "react";

type Props = {
  fetchEndpoint: string;
  deleteEndpoint: (id: number) => string;
  showHeader?: boolean;
  emptyMessage?: string;
  className?: string;
};

export type CommentListRef = {
  addComment: (comment: CommentData) => void;
  refresh: () => void;
};

const CommentList = forwardRef<CommentListRef, Props>(
  (
    {
      fetchEndpoint,
      deleteEndpoint,
      showHeader = true,
      emptyMessage = "아직 댓글이 없습니다. 첫 댓글을 남겨보세요!",
      className,
    },
    ref,
  ) => {
    const {
      comments,
      isLoading,
      error,
      addComment,
      deleteComment,
      isOwnComment,
      refresh,
    } = useComments({
      fetchEndpoint,
      deleteEndpoint,
    });

    useImperativeHandle(ref, () => ({
      addComment,
      refresh,
    }));

    if (isLoading) {
      return (
        <section className={className}>
          <p className="text-center text-sm text-plum-300/60">로딩중...</p>
        </section>
      );
    }

    if (error) {
      return (
        <section className={className}>
          <p className="text-red-300/80 text-center text-sm">{error}</p>
        </section>
      );
    }

    return (
      <section className={className}>
        {showHeader && (
          <h3 className="mb-4 text-lg font-semibold text-plum-100">
            댓글 <span className="text-plum-400">({comments.length})</span>
          </h3>
        )}
        {comments.length === 0 ? (
          <p className="text-center text-sm text-plum-300/60">{emptyMessage}</p>
        ) : (
          <ul className="mb-50 flex w-full flex-col gap-5">
            {comments.map((c) => {
              const isOwn = isOwnComment(c.author);
              return (
                <li
                  key={c.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative w-full rounded-2xl bg-plum-300/20 p-4 ${
                      isOwn ? "rounded-br-none" : "rounded-bl-none"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-md text-plum-300">
                          {c.author}
                        </span>
                        <span className="text-xs text-plum-200/90">
                          {c.createdAt}
                        </span>
                      </div>
                      {isOwn && (
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={() => deleteComment(c.id)}
                          className="hover:text-red-400/80 h-8 w-8 text-plum-300"
                        >
                          <XMarkIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-lg leading-relaxed font-medium text-plum-300">
                      {c.content}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    );
  },
);

CommentList.displayName = "CommentList";

export default CommentList;
