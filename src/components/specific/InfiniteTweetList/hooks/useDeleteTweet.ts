import { api } from "~/utils/api";

type UseToggleLikeProps = {
  id: string;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
};

type UseDeleteTweetType = {
  handleDeleteTweet: () => void;
  loadingDelete: boolean;
};

export const useDeleteTweet = ({
  id,
  user,
}: UseToggleLikeProps): UseDeleteTweetType => {
  const trpcUtils = api.useContext();

  const deleteTweet = api.tweet.delete.useMutation({
    onSuccess: ({ deletedTweet }) => {
      const updateData:
        | Parameters<
            typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
          >[1]
        | null = (oldData) => {
        if (!deletedTweet) return;

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
            tweets: page.tweets.filter((tweet) => tweet.id !== id),
          })),
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
    },
  });

  function handleDeleteTweet() {
    deleteTweet.mutate({ id, tweetUserId: user.id });
  }

  return { handleDeleteTweet, loadingDelete: deleteTweet.isLoading };
};
