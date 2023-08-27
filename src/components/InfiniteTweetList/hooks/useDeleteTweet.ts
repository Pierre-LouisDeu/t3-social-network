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
  handleDeleteTweet: () => void;
};

export const useDeleteTweet = ({
  id,
  user,
}: UseToggleLikeProps): UseToggleLikeType => {
  const trpcUtils = api.useContext();

  const deleteTweet = api.tweet.delete.useMutation({
    // onSuccess: ({ id }) => {
    //   const updateData: Parameters<
    //     typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
    //   >[1] = (oldData) => {
    //     if (oldData == null) return;

    //     return {
    //       ...oldData,
    //       pages: oldData.pages.map((page) => {
    //         return {
    //           ...page,
    //           tweets: page.tweets.map((tweet) => {
    //             if (tweet.id === id) {
    //               return null;
    //             }
    //           }),
    //         };
    //       }),
    //     };
    //   };

    //   trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
    //   trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
    //     { userId: user.id },
    //     updateData
    //   );
    // },
  });

  function handleDeleteTweet() {
    deleteTweet.mutate({ id, tweetUserId: user.id });
  }

  return { handleDeleteTweet };
};
