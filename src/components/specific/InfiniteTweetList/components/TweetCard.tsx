import Link from "next/link";
import { ProfileImage } from "~/components/common/icons/ProfileImage";
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
import { IoLocationSharp } from "react-icons/io5";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import { IconHoverEffect } from "~/components/common/icons/IconHoverEffect";
import dayjs from "dayjs";

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
}: Tweet & CommentCardType) => {
  const router = useRouter();
  const session = useSession();
  const tweetDate = useTimeAgo(createdAt);
  const { handleToggleLike, loadingLikes } = useToggleLike({ id, user });
  const { handleDeleteTweet } = useDeleteTweet({ id, user });
  const [popoverOpenLoc, setPopoverOpenLoc] = useState<boolean>(false);
  const [popoverOpenDate, setPopoverOpenDate] = useState<boolean>(false);

  if (!tweetDate || (!content && !images) || !user) {
    setTweetIsLoading && setTweetIsLoading(true);
    return <SkeletonTweetCard />;
  } else {
    setTweetIsLoading && setTweetIsLoading(false);
  }

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex items-center gap-2">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <div className="text-gray-500">
            <Popover className="relative inline-block text-left">
              <span
                className="h-5 w-5 cursor-pointer fill-blue-400"
                onMouseEnter={() => setPopoverOpenDate(true)}
                onMouseLeave={() => setPopoverOpenDate(false)}
              >
                {tweetDate}
              </span>
              {popoverOpenDate && (
                <Popover.Panel
                  static
                  className="absolute z-10 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none px-2"
                >
                  {dayjs(createdAt).format("h:mm A - MMMM D, YYYY")}
                </Popover.Panel>
              )}
            </Popover>
          </div>
          <span className="hidden text-gray-500 md:block">-</span>
          {address && (
            <Popover className="relative inline-block text-left">
              <IconHoverEffect color="blue" className="relative right-2">
                <IoLocationSharp
                  className="h-5 w-5 cursor-pointer fill-blue-400"
                  onMouseEnter={() => setPopoverOpenLoc(true)}
                  onMouseLeave={() => setPopoverOpenLoc(false)}
                />
              </IconHoverEffect>
              {popoverOpenLoc && (
                <Popover.Panel
                  static
                  className="absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    {address.road && (
                      <div className="block px-4 py-2 text-gray-700">
                        {address.road}
                      </div>
                    )}
                    {address.town && (
                      <div className="block px-4 py-2 text-gray-700">
                        {address.town}
                      </div>
                    )}
                    {address.country && (
                      <div className="block px-4 py-2 text-gray-700">
                        {address.country}
                      </div>
                    )}
                  </div>
                </Popover.Panel>
              )}
            </Popover>
          )}
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <div className="flex flex-row flex-wrap gap-4 pt-2">
          {images?.map((image) => (
            <Image
              className="rounded-lg"
              key={image.id}
              src={image.url}
              width={250}
              height={250}
              alt="Imported image"
            />
          ))}
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
