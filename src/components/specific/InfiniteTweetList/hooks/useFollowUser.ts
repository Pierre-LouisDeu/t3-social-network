import { notifyError } from "~/components/common/toasts/toast";
import { api } from "~/utils/api";

type UseFollowUserProps = {
  id: string;
};

type UseFollowUserType = {
  handleFollowUser: () => void;
  loadingFollow: boolean;
};

export const useFollowUser = ({
  id,
}: UseFollowUserProps): UseFollowUserType => {
  const trpcUtils = api.useContext();

  const toggleFollow = api.profile.toggleFollow.useMutation({
    onError: (err) => {
      notifyError({ message: err.message ?? "Failed to follow user" });
    },
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
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

  function handleFollowUser() {
    toggleFollow.mutate({ userId: id });
  }

  return { handleFollowUser, loadingFollow: toggleFollow.isLoading };
};
