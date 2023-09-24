import { useSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { type UploadFileResponse } from "uploadthing/client";
import { api } from "~/utils/api";

type UseCreateTweetProps = {
  address: {
    latitude?: number;
    longitude?: number;
    country?: string;
    town?: string;
    road?: string;
  } | null;
  inputValue: string;
  setInputValue: (value: string) => void;
  imagesUploaded: UploadFileResponse[];
  setImagesUploaded: (images: UploadFileResponse[]) => void;
};

type UseCreateTweetType = {
  handleCreateTweet: (e: FormEvent<Element>) => void;
  isLoading: boolean;
  error: string | null;
};

export const useCreateTweet = ({
  address,
  inputValue,
  setInputValue,
  imagesUploaded,
  setImagesUploaded,
}: UseCreateTweetProps): UseCreateTweetType => {
  const session = useSession();
  const trpcUtils = api.useContext();

  const createTweet = api.tweet.create.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onError: (clientErrorBase) => {
      setIsLoading(false);
      setError(clientErrorBase.message);
    },
    onSuccess: (newTweet) => {
      setIsLoading(false);
      setError(null);

      setInputValue("");
      setImagesUploaded([]);

      if (session.status !== "authenticated") return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          commentCount: 0,
          likedByMe: false,
          images: imagesUploaded.map((image) => ({
            id: image.key,
            url: image.url,
          })),
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
          address: {
            latitude: address?.latitude,
            longitude: address?.longitude,
            country: address?.country || null,
            town: address?.town || null,
            road: address?.road || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function handleCreateTweet(e: FormEvent) {
    e.preventDefault();

    createTweet.mutate({
      content: inputValue,
      images: imagesUploaded.map((image) => ({
        id: image.key,
        url: image.url,
      })),
      address: {
        latitude: address?.latitude,
        longitude: address?.longitude,
        country: address?.country,
        town: address?.town,
        road: address?.road,
      },
    });
  }

  return { handleCreateTweet, isLoading, error };
};
