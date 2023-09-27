import { useTimeAgo } from "~/components/specific/InfiniteTweetList/hooks/useTimeAgo";
import { type CommentCardType, type Tweet } from "~/types/commonTypes";
import { HeartButton } from "./HeartButton";
import { TrashButton } from "./TrashButton";
import { useToggleLike } from "../hooks/useToggleLike";
import { useDeleteTweet } from "../hooks/useDeleteTweet";
import { useSession } from "next-auth/react";
import { SkeletonTweetCard } from "./SkeletonTweetCard";
import { useRouter } from "next/router";
import { CommentButton } from "./CommentButton";
import Image from "next/image";
import { useState } from "react";
import { ProfilePopover } from "../../../common/popover/ProfilePopover";
import Link from "next/link";
import { LocationPopover } from "~/components/common/popover/LocationPopover";
import { DatePopover } from "~/components/common/popover/DatePopover";

export const TweetCard = ({
  id,
  user,
  content,
  images,
  createdAt,
  likeCount,
  commentCount,
  likedByMe,
  address,
  setTweetIsLoading,
  hideCommentBtn = false,
  hideDeleteBtn = false,
  first = false,
}: Tweet & CommentCardType) => {
  const router = useRouter();
  const session = useSession();
  const tweetDate = useTimeAgo(createdAt);
  const { handleToggleLike, loadingLikes } = useToggleLike({ id, user });
  const { handleDeleteTweet } = useDeleteTweet({ id, user });
  const [popoverOpenLoc, setPopoverOpenLoc] = useState<boolean>(false);
  const [popoverOpenDate, setPopoverOpenDate] = useState<boolean>(false);
  const [popoverOpenProfile, setPopoverOpenProfile] = useState<boolean>(false);

  if (!tweetDate || (!content && !images) || !user) {
    setTweetIsLoading && setTweetIsLoading(true);
    return <SkeletonTweetCard />;
  } else {
    setTweetIsLoading && setTweetIsLoading(false);
  }

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <ProfilePopover
        id={id}
        user={user}
        popoverOpenProfile={popoverOpenProfile}
        setPopoverOpenProfile={setPopoverOpenProfile}
        first={first}
      />
      <div className="flex flex-grow flex-col">
        <div className="flex items-center gap-2">
          <Link
            href={`/profiles/${user.id}`}
            onMouseEnter={() => setPopoverOpenProfile(true)}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <div className="text-gray-500">
            <DatePopover
              tweetDate={tweetDate}
              createdAt={createdAt}
              popoverOpenDate={popoverOpenDate}
              setPopoverOpenDate={setPopoverOpenDate}
              first={first}
            />
          </div>
          <span className="hidden text-gray-500 md:block">-</span>
          {address && (
            <LocationPopover
              address={address}
              popoverOpenLoc={popoverOpenLoc}
              setPopoverOpenLoc={setPopoverOpenLoc}
              first={first}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="whitespace-pre-wrap">{content}</p>
          <div className="flex flex-row flex-wrap gap-4">
            {images?.map((image) => (
              <Image
                className="rounded-lg "
                key={image.id}
                src={image.url}
                width={250}
                height={250}
                alt="Imported image"
              />
            ))}
          </div>
        </div>
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
          {!hideDeleteBtn && user.id === session?.data?.user.id && (
            <TrashButton onClick={handleDeleteTweet} />
          )}
        </div>
      </div>
    </li>
  );
};
