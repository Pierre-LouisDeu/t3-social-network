import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "../../common/icons/LoadingSpinner";
import { type Tweet } from "~/types/commonTypes";
import { TweetCard } from "./components/TweetCard";

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  fetchNewTweets: () => Promise<unknown>;
  hasMore?: boolean;
  tweets?: Tweet[] | null;
};

export function InfiniteTweetList({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore = false,
}: InfiniteTweetListProps) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error...</h1>;

  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
        className="h-100"
      >
        {tweets.map((tweet) => {
          return tweet && <TweetCard key={tweet.id} {...tweet} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}
