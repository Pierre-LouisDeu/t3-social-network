import { api } from "~/utils/api";

type UseToggleLikeProps = {
  id: string;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
};

type UseToggleLikeType = {
  handleToggleLike: () => void;
  loadingLikes: boolean;
};

export const useToggleLike = ({
  id,
  user,
}: UseToggleLikeProps): UseToggleLikeType => {
  const trpcUtils = api.useContext();

  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return tweet;
              }),
            };
          }),
        };
      };

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        updateData
      );
      void trpcUtils.tweet.getById.refetch({
        id,
      });
    },
  });

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  return { handleToggleLike, loadingLikes: toggleLike.isLoading };
};
