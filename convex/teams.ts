import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("teamMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(50);

    const teams = [];
    for (const membership of memberships) {
      const team = await ctx.db.get(membership.teamId);
      if (!team) continue;

      teams.push({
        ...team,
        role: membership.role,
      });
    }

    return teams;
  },
});

export const get = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const team = await ctx.db.get(args.teamId);
    if (!team) return null;

    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId_and_userId", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId),
      )
      .unique();

    if (!membership) return null;

    return { ...team, role: membership.role };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      description: args.description,
      ownerId: userId,
      credits: 0,
    });

    await ctx.db.insert("teamMembers", {
      teamId,
      userId,
      role: "admin",
    });

    return teamId;
  },
});

export const update = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId_and_userId", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId),
      )
      .unique();

    if (!membership || membership.role !== "admin") {
      throw new ConvexError("Only team admins can update team details");
    }

    await ctx.db.patch(args.teamId, {
      name: args.name,
      description: args.description,
    });

    return null;
  },
});

export const remove = mutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new ConvexError("Team not found");
    if (team.ownerId !== userId) {
      throw new ConvexError("Only the team owner can delete a team");
    }

    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    const stories = await ctx.db
      .query("stories")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const story of stories) {
      await ctx.db.patch(story._id, { teamId: undefined });
    }

    await ctx.db.delete(args.teamId);

    return null;
  },
});
