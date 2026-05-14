import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId_and_userId", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId),
      )
      .unique();
    if (!callerMembership) return [];

    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .take(100);

    const result = [];
    for (const member of members) {
      const user = await ctx.db.get(member.userId);
      result.push({
        ...member,
        userName: user?.name ?? "Unknown",
        userEmail: user?.email ?? "",
      });
    }

    return result;
  },
});

export const add = mutation({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId_and_userId", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId),
      )
      .unique();
    if (!callerMembership || callerMembership.role !== "admin") {
      throw new ConvexError("Only admins can add members");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (!targetUser) {
      throw new ConvexError("No user found with that email address");
    }

    const existingMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId_and_userId", (q) =>
        q.eq("teamId", args.teamId).eq("userId", targetUser._id),
      )
      .unique();
    if (existingMembership) {
      throw new ConvexError("User is already a member of this team");
    }

    await ctx.db.insert("teamMembers", {
      teamId: args.teamId,
      userId: targetUser._id,
      role: args.role,
    });

    return null;
  },
});

export const updateRole = mutation({
  args: {
    memberId: v.id("teamMembers"),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const targetMembership = await ctx.db.get(args.memberId);
    if (!targetMembership) throw new ConvexError("Membership not found");

    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId_and_userId", (q) =>
        q.eq("teamId", targetMembership.teamId).eq("userId", userId),
      )
      .unique();
    if (!callerMembership || callerMembership.role !== "admin") {
      throw new ConvexError("Only admins can change member roles");
    }

    await ctx.db.patch(args.memberId, { role: args.role });
    return null;
  },
});

export const remove = mutation({
  args: { memberId: v.id("teamMembers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const targetMembership = await ctx.db.get(args.memberId);
    if (!targetMembership) throw new ConvexError("Membership not found");

    const team = await ctx.db.get(targetMembership.teamId);
    if (!team) throw new ConvexError("Team not found");

    // Cannot remove the team owner
    if (team.ownerId === targetMembership.userId) {
      throw new ConvexError("Cannot remove the team owner");
    }

    // Check if target is admin
    const isTargetAdmin = targetMembership.role === "admin";

    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId_and_userId", (q) =>
        q.eq("teamId", targetMembership.teamId).eq("userId", userId),
      )
      .unique();

    const isSelfRemoval = targetMembership.userId === userId;
    const isCallerAdmin = callerMembership?.role === "admin";
    const isCallerOwner = team.ownerId === userId;

    // Self-removal is always allowed
    if (isSelfRemoval) {
      // Prevent removing the last admin
      if (isTargetAdmin) {
        const allMembers = await ctx.db
          .query("teamMembers")
          .withIndex("by_teamId", (q) => q.eq("teamId", team._id))
          .collect();
        const adminCount = allMembers.filter((m) => m.role === "admin").length;
        if (adminCount <= 1) {
          throw new ConvexError("Cannot remove the last admin");
        }
      }
      await ctx.db.delete(args.memberId);
      return null;
    }

    // Non-self removal requires admin privileges
    if (!isCallerAdmin && !isCallerOwner) {
      throw new ConvexError("Only admins can remove other members");
    }

    // Admin cannot remove another admin (owner can)
    if (isTargetAdmin && !isCallerOwner) {
      throw new ConvexError(
        "Cannot remove another admin. Only the owner can do this.",
      );
    }

    // Prevent removing the last admin
    if (isTargetAdmin) {
      const allMembers = await ctx.db
        .query("teamMembers")
        .withIndex("by_teamId", (q) => q.eq("teamId", team._id))
        .collect();
      const adminCount = allMembers.filter((m) => m.role === "admin").length;
      if (adminCount <= 1) {
        throw new ConvexError("Cannot remove the last admin");
      }
    }

    await ctx.db.delete(args.memberId);
    return null;
  },
});
