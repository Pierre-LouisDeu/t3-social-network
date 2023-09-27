import Link from "next/link";
import { useTimeAgo } from "~/components/specific/InfiniteTweetList/hooks/useTimeAgo";
import { type Comment } from "~/types/commonTypes";
import { TrashButton } from "./TrashButton";
import { useSession } from "next-auth/react";
import { SkeletonTweetCard } from "./SkeletonTweetCard";
import { useDeleteComment } from "../hooks/useDeleteComment";
import { ProfilePopover } from "../../../common/popover/ProfilePopover";
import { useState } from "react";
import { DatePopover } from "~/components/common/popover/DatePopover";
import Image from "next/image";

export const CommentCard = ({
  id,
  tweetId,
  user,
  content,
  images,
  createdAt,
  first = false,
}: Comment) => {
  const session = useSession();
  const tweetDate = useTimeAgo(createdAt);
  const { handleDeleteComment } = useDeleteComment({ id, tweetId });
  const [popoverOpenDate, setPopoverOpenDate] = useState<boolean>(false);
  const [popoverOpenProfile, setPopoverOpenProfile] = useState<boolean>(false);

  const myId = session?.data?.user.id;

  if (!tweetDate || (!content && !images) || !user) {
    return <SkeletonTweetCard />;
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
          {user.id === myId && <TrashButton onClick={handleDeleteComment} />}
        </div>
      </div>
    </li>
  );
};
