import { useSession } from "next-auth/react";
import { type FormEvent } from "react";
import { type UploadFileResponse } from "uploadthing/client";
import { notifyError } from "~/components/common/toasts/toast";
import { api } from "~/utils/api";

type UseToggleLikeProps = {
  inputValue: string;
  tweetId: string;
  setInputValue: (value: string) => void;
  imagesUploaded: UploadFileResponse[];
  setImagesUploaded: (images: UploadFileResponse[]) => void;
};

type UseCreateCommentType = {
  handleCreateComment: (e: FormEvent<Element>) => void;
  isLoading: boolean;
};

export const useCreateComment = ({
  inputValue,
  tweetId,
  setInputValue,
  imagesUploaded,
  setImagesUploaded,
}: UseToggleLikeProps): UseCreateCommentType => {
  const session = useSession();
  const trpcUtils = api.useContext();

  const createComment = api.comment.create.useMutation({
    onError: (error) => {
      notifyError({ message: error.message ?? "Failed to create comment" });
    },
    onSuccess: (newComment) => {
      setInputValue("");
      setImagesUploaded([]);

      if (session.status !== "authenticated") return;

      trpcUtils.comment.infiniteFeed.setInfiniteData({ tweetId }, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheComment = {
          ...newComment,
          tweetId: tweetId,
          images: imagesUploaded.map((image) => ({
            id: image.key,
            url: image.url,
          })),
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

  const handleCreateComment = (e: FormEvent) => {
    e.preventDefault();

    createComment.mutate({
      content: inputValue,
      tweetId: tweetId,
      images: imagesUploaded.map((image) => ({
        id: image.key,
        url: image.url,
      })),
    });
  }

  return { handleCreateComment, isLoading: createComment.isLoading };
};
