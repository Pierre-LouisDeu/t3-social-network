import Link from "next/link";
import { ProfileImage } from "~/components/ProfileImage";
import { useTimeAgo } from "~/components/InfiniteTweetList/hooks/useTimeAgo";
import { type Tweet } from "~/types/commonTypes";
import { HeartButton } from "./HeartButton";
import { TrashButton } from "./TrashButton";
import { useToggleLike } from "../hooks/useToggleLike";
import { useDeleteTweet } from "../hooks/useDeleteTweet";
import { useSession } from "next-auth/react";

export const TweetCard = ({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
  address,
}: Tweet) => {
  const tweetDate = useTimeAgo(createdAt);
  const session = useSession();
  const { handleToggleLike, loadingLikes } = useToggleLike({ id, user });
  const { handleDeleteTweet } = useDeleteTweet({ id, user });

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">{tweetDate}</span>
          {address && (
            <>
              <span className="text-gray-500">-</span>
              <span className="text-blue-500">
                {address.road}, {address.town}, {address.country}
              </span>
            </>
          )}
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <div className="mt-2 flex gap-10">
          <HeartButton
            onClick={handleToggleLike}
            isLoading={loadingLikes}
            likedByMe={likedByMe}
            likeCount={likeCount}
          />
          {user.id === session?.data?.user.id && (
            <TrashButton onClick={handleDeleteTweet} />
          )}
        </div>
      </div>
    </li>
  );
};
