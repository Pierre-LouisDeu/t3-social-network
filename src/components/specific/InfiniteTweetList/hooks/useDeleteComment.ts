import { api } from "~/utils/api";

type UseToggleLikeProps = {
  id: string;
  tweetId: string;
};

type UseDeleteCommentType = {
  handleDeleteComment: () => void;
  loadingDelete: boolean;
};

export const useDeleteComment = ({
  id,
  tweetId,
}: UseToggleLikeProps): UseDeleteCommentType => {
  const trpcUtils = api.useContext();

  const deleteComment = api.comment.delete.useMutation({
    onSuccess: ({ deletedComment }) => {
      const updateData:
        | Parameters<typeof trpcUtils.comment.infiniteFeed.setInfiniteData>[1]
        | null = (oldData) => {
        if (!deletedComment) return;

        if (!oldData) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((comment) => comment.id !== id),
          })),
        };
      };

      trpcUtils.comment.infiniteFeed.setInfiniteData({ tweetId }, updateData);
    },
  });

  function handleDeleteComment() {
    deleteComment.mutate({ id });
  }

  return { handleDeleteComment, loadingDelete: deleteComment.isLoading };
};
