import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import Link from "next/link";
import { IconHoverEffect } from "~/components/common/icons/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import { ProfileImage } from "~/components/common/icons/ProfileImage";
import { InfiniteTweetList } from "~/components/specific/InfiniteTweetList/InfiniteTweetList";
import FollowButton from "~/components/specific/header/FollowButton";
import { LoadingSpinner } from "~/components/common/icons/LoadingSpinner";
import { getPlural } from "~/utils/utils";
import { useFollowUser } from "~/components/specific/InfiniteTweetList/hooks/useFollowUser";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile, isLoading } = api.profile.getById.useQuery({ id });

  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const { handleFollowUser, loadingFollow } = useFollowUser({ id });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`Twitter Clone - ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white/80 backdrop-blur p-4">
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
          isLoading={loadingFollow}
          userId={id}
          onClick={handleFollowUser}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
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
    },
  };
}

export default ProfilePage;
