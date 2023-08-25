import { z } from "zod";

export const Address = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  country: z.string().optional(),
  town: z.string().optional(),
  road: z.string().optional(),
});

export type AddressType = z.infer<typeof Address>;

export type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
  address: {
    country: string | null;
    town: string | null;
    road: string | null;
  } | null;
};
