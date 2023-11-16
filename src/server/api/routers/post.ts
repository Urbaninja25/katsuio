import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    await ctx.db.post.findMany({
      take: 100,
      orderBy: {
        created_at: "desc",
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        question: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const { success } = await ratelimit.limit(authorId);
      // if (!success) {
      //   throw new TRPCError({
      //     code: "TOO_MANY_REQUESTS",
      //   });
      // }

      const post = await ctx.db.post.create({
        data: {
          question: input.question,
        },
      });
      return post;
    }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
});
