import { internalMutation, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const generateUploadUrlInternal = internalMutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const uploadTalentMedia = mutation({
  args: {
    talentId: v.id("talents"),
    type: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("recording"),
    ),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.talentId);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new ConvexError("Failed to get storage URL");

    const mediaId = await ctx.db.insert("talentMedia", {
      talentId: args.talentId,
      type: args.type,
      url,
    });

    return { mediaId, url };
  },
});

export const getStorageUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new ConvexError("Failed to get storage URL");
    return url;
  },
});
