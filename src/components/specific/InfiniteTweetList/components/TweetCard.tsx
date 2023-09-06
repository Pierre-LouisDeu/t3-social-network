import Link from "next/link";
import { ProfileImage } from "~/components/common/icons/ProfileImage";
import { useTimeAgo } from "~/components/specific/InfiniteTweetList/hooks/useTimeAgo";
import { type Tweet } from "~/types/commonTypes";
import { HeartButton } from "./HeartButton";
import { TrashButton } from "./TrashButton";
import { useToggleLike } from "../hooks/useToggleLike";
import { useDeleteTweet } from "../hooks/useDeleteTweet";
import { useSession } from "next-auth/react";
import { SkeletonTweetCard } from "./SkeletonTweetCard";
import { useRouter } from "next/router";
import { CommentButton } from "./CommentButton";

export const TweetCard = ({
  id,
  user,
  content,
  createdAt,
  likeCount,
  commentCount,
  likedByMe,
  address,
  hideCommentBtn = false,
}: Tweet) => {
  const router = useRouter();
  const session = useSession();
  const tweetDate = useTimeAgo(createdAt);
  const { handleToggleLike, loadingLikes } = useToggleLike({ id, user });
  const { handleDeleteTweet } = useDeleteTweet({ id, user });

  if (!tweetDate || !content || !user) {
    return <SkeletonTweetCard />;
  }

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-2">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">{tweetDate}</span>
          <span className="hidden text-gray-500 md:block">-</span>
          {address && (
            <div className="hidden md:block">
              <span className="text-blue-500">
                {address.road && `${address.road}, `}
                {address.town && `${address.town}, `}
                {address.country && `${address.country}`}
              </span>
            </div>
          )}
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <div className="mt-2 flex gap-8">
          <HeartButton
            onClick={handleToggleLike}
            isLoading={loadingLikes}
            likedByMe={likedByMe}
            likeCount={likeCount}
          />
          {!hideCommentBtn && session.status === "authenticated" && (
            <CommentButton
              onClick={() => {
                void router.push(`/tweets/${user.id}/${id}`);
              }}
              commentCount={commentCount}
            />
          )}
          {!hideCommentBtn && user.id === session?.data?.user.id && (
            <TrashButton onClick={handleDeleteTweet} />
          )}
        </div>
      </div>
    </li>
  );
};
