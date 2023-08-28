import { useSession } from "next-auth/react";
import { type FormEvent } from "react";
import { api } from "~/utils/api";

type UseToggleLikeProps = {
  address: {
    latitude?: number;
    longitude?: number;
    country?: string;
    town?: string;
    road?: string;
  } | null;
  inputValue: string;
  setInputValue: (value: string) => void;
};

type UseCreateTweetType = {
  handleCreateTweet: (e: FormEvent<Element>) => void;
};

export const useCreateTweet = ({
  address,
  inputValue,
  setInputValue,
}: UseToggleLikeProps): UseCreateTweetType => {
  const session = useSession();
  const trpcUtils = api.useContext();

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

      if (session.status !== "authenticated") return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
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

  function handleCreateTweet(e: FormEvent) {
    e.preventDefault();

    createTweet.mutate({
      content: inputValue,
      address: {
        latitude: address?.latitude,
        longitude: address?.longitude,
        country: address?.country,
        town: address?.town,
        road: address?.road,
      },
    });
  }

  return { handleCreateTweet };
};