import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import Link from "next/link";
import { IconHoverEffect } from "~/components/common/icons/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import { ProfileImage } from "~/components/common/icons/ProfileImage";
import { TweetCard } from "~/components/specific/InfiniteTweetList/components/TweetCard";
import { LoadingSpinner } from "~/components/common/icons/LoadingSpinner";
import FollowButton from "~/components/specific/header/FollowButton";
import { ssgHelper } from "~/server/api/ssgHelper";
import { useSession } from "next-auth/react";
import { NewCommentForm } from "~/components/specific/NewTweetForm/NewCommentForm";
import { InfiniteCommentList } from "~/components/specific/InfiniteTweetList/InfiniteCommentList";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
  tweetId,
}) => {
  const session = useSession();
  const userId = session?.data?.user.id ?? "";

  const { data: tweet, isLoading: loadingTweet } = api.tweet.getById.useQuery({
    id: tweetId,
  });

  const { data: profile, isLoading: loadingProfile } =
    api.profile.getById.useQuery({
      id,
    });

  const comments = api.comment.infiniteProfileFeed.useInfiniteQuery(
    { tweetId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const trpcUtils = api.useContext();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id: userId }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        };
      });
    },
  });

  if (loadingTweet || loadingProfile) {
    return <LoadingSpinner />;
  }

  if (!profile || !tweet?.user) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`T3 Social Network - Tweet`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white p-4">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <Link href={`/profiles/${id}`}>
          <ProfileImage src={profile.image} />
        </Link>
        <div className="ml-4 flex-grow">
          <Link
            href={`/profiles/${id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {profile.name}
          </Link>
          <div className="text-gray-500">
            {profile.tweetsCount}{" "}
            {getPlural(profile.tweetsCount, "Tweet", "Tweets")} -{" "}
            {profile.followersCount}{" "}
            {getPlural(profile.followersCount, "Follower", "Followers")} -{" "}
            {profile.followsCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          isLoading={toggleFollow.isLoading}
          userId={id}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
      </header>
      <main>
        <TweetCard
          id={tweet.id}
          user={tweet.user}
          content={tweet.content}
          createdAt={tweet.createdAt}
          likeCount={tweet._count.likes}
          commentCount={tweet._count.comment}
          likedByMe={tweet.likes?.length > 0}
          address={tweet.address}
          hideCommentBtn
        />
        <NewCommentForm tweetId={tweetId} />
        <InfiniteCommentList
          comments={comments.data?.pages.flatMap((page) => page.comments)}
          isError={comments.isError}
          isLoading={comments.isLoading}
          hasMore={comments.hasNextPage}
          fetchNewComments={comments.fetchNextPage}
        />
      </main>
    </>
  );
};

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string; tweetId: string }>
) {
  const id = context.params?.id;
  const tweetId = context.params?.tweetId;

  if (id == null || tweetId == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
      tweetId,
    },
  };
}

export default ProfilePage;