import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const checkRateLimit = internalMutation({
  args: {
    key: v.string(),
    maxRequests: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, { key, maxRequests, windowMs }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    if (!existing || now >= existing.resetAt) {
      await ctx.db.insert("rateLimits", {
        key,
        count: 1,
        resetAt: now + windowMs,
      });
      return;
    }

    if (existing.count >= maxRequests) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      throw new ConvexError(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      );
    }

    await ctx.db.patch(existing._id, { count: existing.count + 1 });
  },
});
