import { useSession } from "next-auth/react";
import { Button } from "~/components/common/buttons/Button";

export default function FollowButton({
  userId,
  isFollowing,
  isLoading,
  onClick,
}: {
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }

  return (
    <Button disabled={isLoading} onClick={onClick} small red={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
