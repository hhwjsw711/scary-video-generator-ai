import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const updateCredit = internalMutation({
  args: {
    reduceCredit: v.number(),
    userId: v.id("users"),
    teamId: v.optional(v.id("teams")),
    storyId: v.optional(v.id("stories")),
  },
  // Convex serializes mutations on the same document, guaranteeing
  // that get-then-patch within a single mutation is atomic.
  handler: async (ctx, { reduceCredit, userId, teamId, storyId }) => {
    if (reduceCredit <= 0) {
      throw new ConvexError("reduceCredit must be greater than 0");
    }

    if (teamId) {
      const team = await ctx.db.get(teamId);
      if (!team) throw new ConvexError("Team not found");
      if (team.credits < reduceCredit) {
        throw new ConvexError("Team doesn't have enough credit.");
      }
      await ctx.db.patch(teamId, {
        credits: team.credits - reduceCredit,
      });
      await ctx.db.insert("creditTransactions", {
        userId,
        teamId,
        amount: -reduceCredit,
        type: "consumption",
        description: storyId
          ? `Consumed for story ${storyId}`
          : "Consumed for video generation",
      });
    } else {
      const user = await ctx.db.get(userId);
      if (!user) throw new ConvexError("User not found");
      if (user.credits < reduceCredit) {
        throw new ConvexError("You don't have enough credit.");
      }
      await ctx.db.patch(userId, {
        credits: user.credits - reduceCredit,
      });
      await ctx.db.insert("creditTransactions", {
        userId,
        amount: -reduceCredit,
        type: "consumption",
        description: storyId
          ? `Consumed for story ${storyId}`
          : "Consumed for video generation",
      });
    }
  },
});

export const addCredit = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    type: v.union(
      v.literal("purchase"),
      v.literal("signup_bonus"),
      v.literal("refund"),
    ),
    description: v.string(),
    stripePaymentId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { userId, amount, type, description, stripePaymentId },
  ) => {
    // Idempotency: skip if this Stripe payment was already processed
    if (stripePaymentId) {
      const existing = await ctx.db
        .query("creditTransactions")
        .withIndex("by_stripePaymentId", (q) =>
          q.eq("stripePaymentId", stripePaymentId),
        )
        .take(1);
      if (existing.length > 0) return;
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("User not found");
    await ctx.db.patch(userId, {
      credits: user.credits + amount,
    });
    await ctx.db.insert("creditTransactions", {
      userId,
      amount,
      type,
      description,
      stripePaymentId,
    });
  },
});

export const addTeamCredit = internalMutation({
  args: {
    teamId: v.id("teams"),
    userId: v.id("users"),
    amount: v.number(),
    description: v.string(),
    stripePaymentId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { teamId, userId, amount, description, stripePaymentId },
  ) => {
    // Idempotency: skip if this Stripe payment was already processed
    if (stripePaymentId) {
      const existing = await ctx.db
        .query("creditTransactions")
        .withIndex("by_stripePaymentId", (q) =>
          q.eq("stripePaymentId", stripePaymentId),
        )
        .take(1);
      if (existing.length > 0) return;
    }

    const team = await ctx.db.get(teamId);
    if (!team) throw new ConvexError("Team not found");
    await ctx.db.patch(teamId, {
      credits: team.credits + amount,
    });
    await ctx.db.insert("creditTransactions", {
      userId,
      teamId,
      amount,
      type: "purchase",
      description,
      stripePaymentId,
    });
  },
});

export const getUserTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    return await ctx.db
      .query("creditTransactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const getTeamTransactions = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    return await ctx.db
      .query("creditTransactions")
      .withIndex("by_teamId", (q) => q.eq("teamId", teamId))
      .order("desc")
      .take(50);
  },
});
