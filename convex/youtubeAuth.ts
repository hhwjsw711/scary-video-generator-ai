import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const saveState = internalMutation({
  args: {
    token: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, { token, userId }) => {
    await ctx.db.insert("youtubeAuthStates", {
      token,
      userId,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
  },
});

export const consumeState = internalMutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const record = await ctx.db
      .query("youtubeAuthStates")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (!record || Date.now() > record.expiresAt) {
      throw new ConvexError("Invalid or expired state token");
    }
    await ctx.db.delete(record._id);
    return record.userId;
  },
});

export const getState = internalQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const record = await ctx.db
      .query("youtubeAuthStates")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (!record || Date.now() > record.expiresAt) {
      return null;
    }
    return record;
  },
});
