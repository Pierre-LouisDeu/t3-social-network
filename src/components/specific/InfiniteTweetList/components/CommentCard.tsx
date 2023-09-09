import Link from "next/link";
import { ProfileImage } from "~/components/common/icons/ProfileImage";
import { useTimeAgo } from "~/components/specific/InfiniteTweetList/hooks/useTimeAgo";
import { type Comment } from "~/types/commonTypes";
import { TrashButton } from "./TrashButton";
import { useSession } from "next-auth/react";
import { SkeletonTweetCard } from "./SkeletonTweetCard";
import { useDeleteComment } from "../hooks/useDeleteComment";

export const CommentCard = ({ id, tweetId, user, content, createdAt }: Comment) => {
  const session = useSession();
  const tweetDate = useTimeAgo(createdAt);
  const { handleDeleteComment } = useDeleteComment({ id, tweetId });

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
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <div className="mt-2 flex gap-8">
          {user.id === session?.data?.user.id && (
            <TrashButton onClick={handleDeleteComment} />
          )}
        </div>
      </div>
    </li>
  );
};
