import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "../../common/icons/LoadingSpinner";
import { type Comment } from "~/types/commonTypes";
import { CommentCard } from "./components/CommentCard";

type InfiniteCommentListProps = {
  isError: boolean;
  isLoading: boolean;
  fetchNewComments: () => Promise<unknown>;
  hasMore?: boolean;
  comments?: Comment[];
};

export function InfiniteCommentList({
  comments,
  isError,
  isLoading,
  fetchNewComments,
  hasMore = false,
}: InfiniteCommentListProps) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error...</h1>;

  if (comments == null || comments.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No comment</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchNewComments}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
        style={{ overflow: "visible" }}
      >
        {comments.map((comment) => {
          return comment && <CommentCard key={comment.id} {...comment} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}
