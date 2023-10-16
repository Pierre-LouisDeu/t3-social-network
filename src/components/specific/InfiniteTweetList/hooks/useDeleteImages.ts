import { notifyError, notifySuccess } from "~/components/common/toasts/toast";
import { api } from "~/utils/api";

type UseDeleteImagesType = {
  handleDeleteImages: (keys: string | string[]) => void;
};

export const useDeleteImages = (): UseDeleteImagesType => {
  const deleteImages = api.tweet.deleteImages.useMutation({
    onSuccess: () => {
      notifySuccess({ message: "Image deleted" });
    },
    onError: () => {
      notifyError({ message: "Unable to delete image" });
    },
  });

  function handleDeleteImages(keys: string | string[]) {
    deleteImages.mutate({ keys });
  }

  return { handleDeleteImages };
};
