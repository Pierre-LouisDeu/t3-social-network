import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { api } from "~/utils/api";

type UseToggleLikeProps = {
  inputValue: string;
  tweetId: string;
  setInputValue: (value: string) => void;
};

type UseCreateCommentType = {
  handleCreateComment: (e: FormEvent<Element>) => void;
  isLoading: boolean;
  error: string | null;
};

export const useCreateComment = ({
  inputValue,
  tweetId,
  setInputValue,
}: UseToggleLikeProps): UseCreateCommentType => {
  const session = useSession();
  const trpcUtils = api.useContext();

  const createComment = api.comment.create.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onError: (clientErrorBase) => {
      setIsLoading(false);
      setError(clientErrorBase.message);
    },
    onSuccess: (newComment) => {
      setIsLoading(false);
      setError(null);

      setInputValue("");

      if (session.status !== "authenticated") return;

      trpcUtils.comment.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheComment = {
          ...newComment,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              comments: [newCacheComment, ...oldData.pages[0].comments],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function handleCreateComment(e: FormEvent) {
    e.preventDefault();

    createComment.mutate({
      content: inputValue,
      tweetId: tweetId,
    });
  }

  return { handleCreateComment, isLoading, error };
};
