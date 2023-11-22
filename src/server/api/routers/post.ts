import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
  getAllByUserNames: publicProcedure
    .input(z.object({ userNames: z.string() }))
    .query(async ({ ctx, input }) => {
      const activities = await ctx.db.post.findUnique({
        where: { hostUsername: input.userNames },
        take: 100,
      });
      if (!activities) throw new TRPCError({ code: "NOT_FOUND" });
      return activities;
    }),
});
