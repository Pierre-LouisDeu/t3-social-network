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
import { zImage } from "~/types/commonTypes";

export const commentRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          images: {
            select: { id: true, url: true },
          },
          createdAt: true,
          user: {
            select: { name: true, id: true, image: true },
          },
        },
      });

      return comment;
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { tweetId, limit = 10, cursor }, ctx }) => {
      return await getInfiniteComments({
        limit,
        ctx,
        cursor,
        whereClause: { tweetId },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        images: zImage,
        tweetId: z.string(),
      })
    )
    .mutation(async ({ input: { content, images, tweetId }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const comment = await ctx.prisma.comment.create({
        data: {
          content,
          images: {
            create: images?.map((image) => ({
              id: image.id,
              url: image.url,
              tweet: { connect: { id: tweetId } }, // TODO: remove this line and fix the issue 
            })),
          },
          tweetId,
          userId: currentUserId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: { name: true, id: true, image: true },
          },
        },
      });

      return comment;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        return { deletedComment: false };
      }

      await ctx.prisma.comment.delete({ where: { id } });
      return { deletedComment: true };
    }),
});

async function getInfiniteComments({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.CommentWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const data = await ctx.prisma.comment.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      tweetId: true,
      content: true,
      images: {
        select: { id: true, url: true },
      },
      createdAt: true,
      user: {
        select: { name: true, id: true, image: true },
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
    comments: data.map((comment) => {
      return {
        id: comment.id,
        tweetId: comment.tweetId,
        content: comment.content,
        images: comment.images?.map((image) => ({
          id: image.id,
          url: image.url,
        })),
        createdAt: comment.createdAt,
        user: comment.user,
      };
    }),
    nextCursor,
  };
}
