/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Prisma } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";
import { zAddress, zImage } from "~/types/commonTypes";
import { deleteImages } from "../images/images";
import { utapi } from "uploadthing/server";

export const tweetRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const tweet = await ctx.prisma.tweet.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          images: {
            select: { id: true, url: true },
          },
          createdAt: true,
          _count: { select: { likes: true, comment: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: { name: true, id: true, image: true },
          },
          address: {
            select: { country: true, town: true, road: true },
          },
        },
      });

      return tweet;
    }),
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: { userId },
      });
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfiniteTweets({
          limit,
          ctx,
          cursor,
          whereClause:
            currentUserId == null || !onlyFollowing
              ? undefined
              : {
                  user: {
                    followers: { some: { id: currentUserId } },
                  },
                },
        });
      }
    ),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        images: zImage,
        address: zAddress,
      })
    )
    .mutation(async ({ input: { content, images, address }, ctx }) => {
      if (!content && (!images || images.length === 0)) {
        throw new Error("A tweet must have content");
      }

      const tweet = await ctx.prisma.tweet.create({
        data: {
          content,
          images: {
            create: images?.map((image) => ({
              id: image.id,
              url: image.url,
            })),
          },
          userId: ctx.session.user.id,
          address: {
            create: {
              latitude: address?.latitude,
              longitude: address?.longitude,
              country: address?.country,
              town: address?.town,
              road: address?.road,
            },
          },
        },
      });

      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);

      return tweet;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        tweetUserId: z.string(),
      })
    )
    .mutation(async ({ input: { id, tweetUserId }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };

      if (tweetUserId !== data.userId) {
        return { deletedTweet: false };
      }

      const images = await ctx.prisma.image.findMany({
        where: {
          OR: [
            { id: data.tweetId },
            { comment: { tweet: { id: { equals: data?.tweetId } } } },
          ],
        },
      });

      await deleteImages(images);

      await ctx.prisma.tweet.delete({ where: { id: data.tweetId } });
      return { deletedTweet: true };
    }),
  deleteImages: protectedProcedure
    .input(z.object({ keys: z.string().or(z.array(z.string())) }))
    .mutation(async ({ input: { keys } }) => {
      await utapi.deleteFiles(keys);
      return { deletedImages: true };
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });

      if (existingLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
  fullTextSearch: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input: { query }, ctx }) => {
      if (query.length < 3) {
        return [];
      }
      const result = await ctx.prisma.tweet.findMany({
        where: {
          content: {
            search: query,
          },
        },
      });
      return result;
    }),
});

async function getInfiniteTweets({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.TweetWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      images: {
        select: { id: true, url: true },
      },
      createdAt: true,
      _count: { select: { likes: true, comment: true } },
      likes:
        currentUserId == null ? false : { where: { userId: currentUserId } },
      user: {
        select: { name: true, id: true, image: true },
      },
      address: {
        select: { country: true, town: true, road: true },
      },
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    tweets: data.map((tweet) => {
      return {
        id: tweet.id,
        content: tweet.content,
        images: tweet.images?.map((image) => ({
          id: image.id,
          url: image.url,
        })),
        createdAt: tweet.createdAt,
        likeCount: tweet._count.likes,
        commentCount: tweet._count.comment,
        user: tweet.user,
        likedByMe: tweet.likes?.length > 0,
        address: tweet.address,
      };
    }),
    nextCursor,
  };
}
