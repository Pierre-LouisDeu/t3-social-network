import { z } from "zod";

export const zAddress = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  country: z.string().optional(),
  town: z.string().optional(),
  road: z.string().optional(),
});

export const zImage = z.array(
  z.object({
    id: z.string(),
    url: z.string(),
  })
);

export type AddressType = z.infer<typeof zAddress>;
export type ImageType = z.infer<typeof zImage>;

export type Tweet = {
  id: string;
  content: string;
  images: ImageType;
  createdAt: Date;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
  address: {
    country: string | null;
    town: string | null;
    road: string | null;
  } | null;
};

export type CommentCardType = {
  setTweetIsLoading?: (isLoading: boolean) => void;
  hideCommentBtn?: boolean;
  hideDeleteBtn?: boolean;
  first?: boolean;
};

export type Comment = {
  id: string;
  tweetId: string;
  content: string;
  images: ImageType;
  createdAt: Date;
  user: { id: string; image: string | null; name: string | null };
  first?: boolean;
};
