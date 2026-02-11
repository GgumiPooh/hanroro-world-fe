import CommentInput from "@/components/CommentInput";
import CommentList, { type CommentListHandle } from "@/components/CommentList";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import type { Comment } from "@/types/comment";
import { useRef, type FC } from "react";

const ToArtist: FC = () => {
  const commentListHandle = useRef<CommentListHandle>(null);

  return (
    <div className="relative scrollbar-hide h-dvh overflow-y-auto pt-50">
      <div className="fixed inset-0 -z-1 bg-gray-900/70" />
      <ImageWithPlaceholder
        className="fixed inset-0 -z-2 h-dvh w-full"
        imgClassName="object-cover object-center backdrop-blur-sm"
        src="/images/home-banner3.png"
        alt="background"
      />

      <div className="mx-auto w-[min(92vw,700px)] px-4 pb-40">
        <h1 className="mb-6 text-center text-4xl font-bold text-plum-100 md:mb-10 md:text-6xl">
          To. RORO
        </h1>

        <CommentList
          ref={commentListHandle}
          fetchEndpoint="/api/public/message"
          deleteEndpoint={(id) => `/api/public/message/${id}`}
          showHeader={false}
          emptyMessage="아직 메시지가 없습니다. 첫 메시지를 남겨보세요!"
        />
      </div>

      <CommentInput
        apiEndpoint="/api/public/message"
        onCommentSubmit={handleMessageSubmit}
        placeholder="비방적인 글 작성 시 관리자에 의해 삭제될 수 있습니다."
      />
    </div>
  );

  function handleMessageSubmit(newComment: Comment) {
    commentListHandle.current?.addComment(newComment);
  }
};

export default ToArtist;
