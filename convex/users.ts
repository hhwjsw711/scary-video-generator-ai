import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});

export const update = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const patch: Record<string, string> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.image !== undefined) patch.image = args.image;

    await ctx.db.patch(userId, patch);
  },
});
