import { Popover } from "@headlessui/react";
import Link from "next/link";
import { ProfileImage } from "~/components/common/icons/ProfileImage";
import { getPlural } from "~/utils/utils";
import FollowButton from "../../specific/header/FollowButton";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useFollowUser } from "../../specific/InfiniteTweetList/hooks/useFollowUser";
import { useEffect, type Dispatch, type SetStateAction } from "react";

type ProiflePopoverProps = {
  id: string;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
  popoverOpenProfile: boolean;
  setPopoverOpenProfile: Dispatch<SetStateAction<boolean>>;
  first?: boolean;
};

export const ProfilePopover = ({
  id,
  user,
  popoverOpenProfile,
  setPopoverOpenProfile,
  first = false,
}: ProiflePopoverProps) => {
  const session = useSession();
  const myId = session?.data?.user.id;

  const { data: profile } = api.profile.getById.useQuery({
    id: user.id,
  });

  const { handleFollowUser, loadingFollow } = useFollowUser({ id: user.id });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (popoverOpenProfile) {
        setPopoverOpenProfile(false);
      }
    }, 3000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popoverOpenProfile]);

  return (
    <Popover className="relative inline-block text-left">
      <Link
        href={`/profiles/${user.id}`}
        onMouseEnter={() => setPopoverOpenProfile(true)}
        className="font-bold outline-none hover:underline focus-visible:underline"
      >
        <ProfileImage src={user.image} />
      </Link>
      {popoverOpenProfile && profile && (
        <Popover.Panel
          onMouseLeave={() => setPopoverOpenProfile(false)}
          className={`absolute ${
            !first ? "bottom-full" : ""
          } z-20 mb-2 w-52 rounded-md bg-white/80 px-3 py-2 text-xs text-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-md focus:outline-none`}
          static
        >
          <div className="w-54 h-24">
            <div className="flex items-center gap-4">
              <Link href={`/profiles/${user.id}`}>
                <ProfileImage src={user.image} />
              </Link>
              <div className="flex flex-col gap-1 text-center">
                <Link
                  className="text-underline text-sm font-bold"
                  href={`/profiles/${user.id}`}
                >
                  {user.name}
                </Link>
                <p>
                  <span className="font-bold">{profile.tweetsCount} </span>
                  {getPlural(profile.tweetsCount, "Tweet", "Tweets")}
                </p>
                {user.id !== myId && (
                  <FollowButton
                    isFollowing={profile.isFollowing}
                    isLoading={loadingFollow}
                    userId={id}
                    onClick={handleFollowUser}
                  />
                )}
              </div>
            </div>
            <div className="flex w-full flex-row justify-center gap-2 pt-2">
              <p>
                <span className="font-bold">{profile.followsCount} </span>
                {getPlural(profile.followsCount, "Following", "Followings")}
              </p>
              <p>
                <span className="font-bold">{profile.followersCount} </span>
                {getPlural(profile.followersCount, "Follower", "Followers")}
              </p>
            </div>
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
};
