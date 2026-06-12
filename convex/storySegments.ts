import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const get = query({
  args: { id: v.id("storySegments") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthenticated");
    const segment = await ctx.db.get(id);
    if (!segment) return null;
    const hasAccess = await ctx.runQuery(
      internal.stories.isStoryBelongsToUser,
      {
        storyId: segment.storyId,
        userId,
      },
    );
    if (!hasAccess) throw new ConvexError("Forbidden");
    return segment;
  },
});
export const edit = mutation({
  args: {
    id: v.id("storySegments"),
    imagePrompt: v.optional(v.string()),
    text: v.optional(v.string()),
    imageStatus: v.optional(
      v.union(
        v.object({
          status: v.literal("pending"),
          details: v.string(),
        }),
        v.object({
          status: v.literal("failed"),
          reason: v.string(),
          elapsedMs: v.number(),
        }),
        v.object({
          status: v.literal("saved"),
          imageUrl: v.string(),
          publicId: v.string(),
          elapsedMs: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthenticated");
    const segment = await ctx.db.get(args.id);
    if (!segment) throw new ConvexError("Segment not found");
    const story = await ctx.runQuery(api.stories.get, { id: segment.storyId });
    if (!story || story.userId !== userId)
      throw new ConvexError("Segment not found");
    await ctx.db.patch(args.id, {
      text: args.text ? args.text : segment.text,
      imagePrompt: args.imagePrompt ? args.imagePrompt : segment.imagePrompt,
      imageStatus: args.imageStatus ? args.imageStatus : segment.imageStatus,
    });
    if (segment.text !== args.text) {
      await ctx.scheduler.runAfter(0, internal.stories.rebuildStoryContent, {
        storyId: story._id,
      });
    }
  },
});
export const internalEdit = internalMutation({
  args: {
    id: v.id("storySegments"),
    text: v.optional(v.string()),
    imagePrompt: v.optional(v.string()),
    order: v.optional(v.number()),
    imageStatus: v.optional(
      v.union(
        v.object({
          status: v.literal("pending"),
          details: v.string(),
        }),
        v.object({
          status: v.literal("failed"),
          reason: v.string(),
          elapsedMs: v.number(),
        }),
        v.object({
          status: v.literal("saved"),
          imageUrl: v.string(),
          publicId: v.string(),
          elapsedMs: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.id);
    if (!segment) throw new ConvexError("Segment not found");
    await ctx.db.patch(args.id, {
      text: args.text ? args.text : segment.text,
      imagePrompt: args.imagePrompt ? args.imagePrompt : segment.imagePrompt,
      order: args.order ? args.order : segment.order,
      imageStatus: args.imageStatus ? args.imageStatus : segment.imageStatus,
    });
  },
});
export const editImageStatus = internalMutation({
  args: {
    id: v.id("storySegments"),
    imageStatus: v.union(
      v.object({
        status: v.literal("pending"),
        details: v.string(),
      }),
      v.object({
        status: v.literal("failed"),
        reason: v.string(),
        elapsedMs: v.number(),
      }),
      v.object({
        status: v.literal("saved"),
        imageUrl: v.string(),
        elapsedMs: v.number(),
        publicId: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { imageStatus: args.imageStatus });
  },
});
export const getByStoryId = query({
  args: { storyId: v.id("stories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthenticated");
    const hasAccess = await ctx.runQuery(
      internal.stories.isStoryBelongsToUser,
      {
        storyId: args.storyId,
        userId,
      },
    );
    if (!hasAccess) throw new ConvexError("Forbidden");
    const records = await ctx.db
      .query("storySegments")
      .withIndex("storyId", (q) => q.eq("storyId", args.storyId))
      .collect();
    return records.sort((a, b) => a.order - b.order);
  },
});
export const getFirstSegmentImage = query({
  args: { storyId: v.id("stories") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthenticated");
    const hasAccess = await ctx.runQuery(
      internal.stories.isStoryBelongsToUser,
      {
        storyId: args.storyId,
        userId,
      },
    );
    if (!hasAccess) throw new ConvexError("Forbidden");
    const records = await ctx.db
      .query("storySegments")
      .withIndex("storyId", (q) => q.eq("storyId", args.storyId))
      .order("asc")
      .take(1);
    if (records.length === 0) return null;
    return records[0]!.imageStatus.status === "saved"
      ? records[0]!.imageStatus.imageUrl
      : null;
  },
});
export const isSegmentBelongToStoryAndUser = internalQuery({
  args: {
    segmentId: v.id("storySegments"),
    userId: v.id("users"),
  },
  handler: async (ctx, { segmentId, userId }) => {
    const segment = await ctx.db.get(segmentId);
    if (!segment) return false;
    const story = await ctx.db.get(segment.storyId);
    if (!story) return false;
    if (story.userId === userId) return true;
    if (story.teamId) {
      const teamId = story.teamId;
      const membership = await ctx.db
        .query("teamMembers")
        .withIndex("by_teamId_and_userId", (q) =>
          q.eq("teamId", teamId).eq("userId", userId),
        )
        .unique();
      return !!membership;
    }
    return false;
  },
});
export const insert = mutation({
  args: {
    imagePrompt: v.string(),
    text: v.string(),
    storyId: v.id("stories"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Unauthenticated");
    }
    if (
      !(await ctx.runQuery(internal.stories.isStoryBelongsToUser, {
        storyId: args.storyId,
        userId,
      }))
    )
      throw new ConvexError("Forbidden");
    const segmentWithLargerOrders = await ctx.db
      .query("storySegments")
      .withIndex("storyId", (q) => q.eq("storyId", args.storyId))
      .filter((q) => q.gte(q.field("order"), args.order))
      .collect();
    await Promise.all(
      segmentWithLargerOrders.map(async (s) => {
        await ctx.db.patch(s._id, { order: s.order + 1 });
      }),
    );
    await ctx.db.insert("storySegments", {
      imagePrompt: args.imagePrompt,
      text: args.text,
      storyId: args.storyId,
      order: args.order,
      imageStatus: {
        status: "pending",
        details: "Creating image...",
      },
    });
  },
});
export const internalInsert = internalMutation({
  args: {
    imagePrompt: v.string(),
    text: v.string(),
    storyId: v.id("stories"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("storySegments", {
      imagePrompt: args.imagePrompt,
      text: args.text,
      storyId: args.storyId,
      order: args.order,
      imageStatus: {
        status: "idle",
      },
    });
  },
});
export const internalBulkInsert = internalMutation({
  args: {
    segments: v.array(
      v.object({
        imagePrompt: v.string(),
        text: v.string(),
        order: v.number(),
        storyId: v.id("stories"),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.segments.map((s, i) =>
        ctx.db.insert("storySegments", {
          imagePrompt: s.imagePrompt,
          text: s.text,
          storyId: s.storyId,
          order: s.order,
          imageStatus: {
            status: "pending",
            details: "Creating image...",
          },
        }),
      ),
    );
  },
});
export const saveSegments = internalMutation({
  args: {
    segments: v.array(v.object({ segment: v.string(), image: v.string() })),
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.segments.map((s, i) =>
        ctx.db.insert("storySegments", {
          imagePrompt: s.image,
          text: s.segment,
          storyId: args.storyId,
          order: i + 1,
          imageStatus: {
            status: "pending",
            details: "Creating image...",
          },
        }),
      ),
    );
  },
});
export const internalDeleteStorySegment = internalMutation({
  args: { id: v.id("storySegments") },
  handler: async (ctx, args) => {
    const segment = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);
    if (segment)
      await ctx.scheduler.runAfter(0, internal.stories.rebuildStoryContent, {
        storyId: segment.storyId,
      });
  },
});
export const deleteSegment = mutation({
  args: { id: v.id("storySegments") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    if (
      !(await ctx.runQuery(
        internal.storySegments.isSegmentBelongToStoryAndUser,
        {
          segmentId: id,
          userId: userId,
        },
      ))
    )
      throw new ConvexError("Forbidden");
    const segment = (await ctx.db.get(id)) as NonNullable<Doc<"storySegments">>;
    await ctx.db.delete(id);
    const segmentWithLargerOrders = await ctx.db
      .query("storySegments")
      .withIndex("storyId", (q) => q.eq("storyId", segment.storyId))
      .filter((q) => q.gt(q.field("order"), segment.order))
      .collect();
    await Promise.all(
      segmentWithLargerOrders.map(async (s) => {
        await ctx.db.patch(s._id, { order: s.order - 1 });
      }),
    );
    await ctx.scheduler.runAfter(0, internal.stories.rebuildStoryContent, {
      storyId: segment.storyId,
    });
  },
});
export const autoGenerateImage = mutation({
  args: {
    segmentId: v.id("storySegments"),
  },
  handler: async (ctx, { segmentId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    await ctx.runMutation(internal.ratelimit.checkRateLimit, {
      key: `img-gen:${userId}`,
      maxRequests: 30,
      windowMs: 3600000,
    });

    // Get the segment
    const segment = await ctx.db.get(segmentId);
    if (!segment) throw new ConvexError("Segment not found");

    // Get the story to check ownership and get context
    const story = await ctx.runQuery(api.stories.get, { id: segment.storyId });
    if (
      !story ||
      !(await ctx.runQuery(internal.stories.isStoryBelongsToUser, {
        storyId: segment.storyId,
        userId,
      }))
    )
      throw new ConvexError("Unauthorized");

    // Update segment status to pending
    await ctx.db.patch(segmentId, {
      imageStatus: {
        status: "pending",
        details: "Generating image...",
      },
    });

    // If no prompt exists, schedule prompt generation first
    if (!segment.imagePrompt) {
      const context =
        story.context && story.context.state === "saved"
          ? story.context.data
          : "";

      await ctx.scheduler.runAfter(0, internal.stories.generateImagePromptJob, {
        segmentId,
        context,
        story: story.content,
        segment: segment.text,
        format: story.format ?? "16:9",
        storyId: story._id,
      });
    } else {
      // If prompt exists, just regenerate the image
      await ctx.scheduler.runAfter(0, internal.stories.generateImagePromptJob, {
        segmentId,
        context: story.context?.state === "saved" ? story.context.data : "",
        story: story.content,
        segment: segment.text,
        format: story.format ?? "16:9",
        storyId: story._id,
      });
    }

    return "ok";
  },
});
