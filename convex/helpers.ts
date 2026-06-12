import { ConvexError } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export async function requireTeamMembership(
  ctx: { db: QueryCtx["db"] },
  teamId: Id<"teams">,
  userId: Id<"users">,
) {
  const membership = await ctx.db
    .query("teamMembers")
    .withIndex("by_teamId_and_userId", (q) =>
      q.eq("teamId", teamId).eq("userId", userId),
    )
    .unique();
  if (!membership) {
    throw new ConvexError("You are not a member of this team");
  }
  return membership;
}

export async function ensureOwnership<T extends { userId: Id<"users"> }>(
  doc: T | null,
  userId: Id<"users">,
  notFoundMessage = "Not found",
) {
  if (!doc) throw new ConvexError(notFoundMessage);
  if (doc.userId !== userId) throw new ConvexError("Forbidden");
  return doc;
}
