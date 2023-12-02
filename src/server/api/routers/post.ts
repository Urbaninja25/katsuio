import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    await ctx.db.activity.findMany({
      take: 100,
    });
  }),
  getAllByUserNames: publicProcedure
    .input(z.object({ userNameData: z.string() }))
    .query(async ({ ctx, input }) => {
      const userNameDataArray = input.userNameData.split(",");
      console.log(userNameDataArray);

      const activities = await ctx.db.activity.findMany({
        where: {
          OR: userNameDataArray.map((userName) => ({
            hostUsername: userName.trim(), // Trim to remove extra spaces
          })),
        },
      });

      if (!activities || activities.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return activities;
    }),
});
