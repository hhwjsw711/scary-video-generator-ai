import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import {
  httpAction,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { filter } from "convex-helpers/server/filter";
import { calculateVideoCredits } from "../src/lib/calculate-credits";

export const get = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const video = await ctx.db.get(args.id);
    if (!video) throw new ConvexError("Video not found");
    if (
      await ctx.runQuery(internal.videos.isVideoBelongToUser, {
        videoId: video?._id,
        userId: userId,
      })
    ) {
      return video;
    } else throw new ConvexError("Video not found");
  },
});

export const internalGet = internalQuery({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) throw new ConvexError("Video not found");
    return video;
  },
});

export const isVideoBelongToUser = internalQuery({
  args: { videoId: v.id("videos"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.videoId);
    if (!video) throw new ConvexError("Video not found");
    const story = await ctx.db.get(video.storyId);
    if (!story) return false;
    if (story.userId === args.userId) return true;
    if (story.teamId) {
      const teamId = story.teamId;
      const membership = await ctx.db
        .query("teamMembers")
        .withIndex("by_teamId_and_userId", (q) =>
          q.eq("teamId", teamId).eq("userId", args.userId),
        )
        .unique();
      return !!membership;
    }
    return false;
  },
});

export const create = mutation({
  args: { storyId: v.id("stories"), name: v.string() },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthorized");

    // Get story and user data
    const story = await ctx.runQuery(api.stories.get, { id: args.storyId });
    const user = await ctx.db.get(userId);

    if (!story || !user) throw new ConvexError("Story or user not found");
    if (
      !(await ctx.runQuery(internal.stories.isStoryBelongsToUser, {
        storyId: args.storyId,
        userId,
      }))
    )
      throw new ConvexError("Story not found");

    // Calculate required credits
    const segments = await ctx.db
      .query("storySegments")
      .withIndex("storyId", (q) => q.eq("storyId", story._id))
      .collect();

    const storyText = segments.reduce(
      (acc, segment) => acc + segment.text + " ",
      "",
    );
    const requiredCredits = calculateVideoCredits(
      storyText,
      segments.length,
    ).totalCredits;

    // Check credits based on team ownership
    if (story.teamId) {
      const team = await ctx.db.get(story.teamId);
      if (!team) throw new ConvexError("Team not found");
      if (team.credits < requiredCredits) {
        throw new ConvexError(
          `Team doesn't have enough credits. Required: ${requiredCredits}, Available: ${team.credits}`,
        );
      }
    } else {
      if (user.credits < requiredCredits) {
        throw new ConvexError(
          `Not enough credits. Required: ${requiredCredits}, Available: ${user.credits}`,
        );
      }
    }

    // Deduct credits
    await ctx.runMutation(internal.credits.updateCredit, {
      reduceCredit: requiredCredits,
      userId,
      teamId: story.teamId,
      storyId: story._id,
    });

    // Create video
    const videoId = await ctx.db.insert("videos", {
      storyId: args.storyId,
      name: args.name,
      result: { status: "pending", details: "Creating video ..." },
    });

    // clone all story segment to video segment
    const storySegment = await ctx.db
      .query("storySegments")
      .withIndex("storyId", (q) => q.eq("storyId", story._id))
      .collect();
    if (storySegment.some((s) => s.imageStatus.status !== "saved"))
      throw new ConvexError(`Some images of story is not generated.`);
    await Promise.all(
      storySegment.map(async (s) => {
        if (s.imageStatus.status === "saved") {
          const videoSegmentId = await ctx.db.insert("videoSegments", {
            imagePrompt: s.imagePrompt,
            imageUrl: s.imageStatus.imageUrl,
            order: s.order,
            text: s.text,
            videoId,
            videoStatus: {
              status: "pending",
              details: "Waiting for voice ...",
            },
            voiceStatus: { status: "pending", details: "Creating voice ..." },
          });
          await ctx.scheduler.runAfter(
            0,
            internal.sqs.sendSqsMessageGenerateVoice,
            {
              attributes: {
                segmentId: {
                  DataType: "String",
                  StringValue: videoSegmentId,
                },
                videoId: { DataType: "String", StringValue: videoId },
              },
              message: s.text,
            },
          );
        } else
          throw new ConvexError(
            `ImageUrl of storySegment with id ${s._id} is empty `,
          );
      }),
    );

    return videoId;
  },
});

export const getCurrentUserVideos = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthenticated");
    const stories = await ctx.db
      .query("stories")
      .withIndex("by_userId_and_teamId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    const rs = await Promise.all(
      stories.map((s) =>
        ctx.db
          .query("videos")
          .withIndex("storyId", (q) => q.eq("storyId", s._id))
          .order("desc")
          .collect(),
      ),
    );
    return rs.reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);
  },
});

export const getCurrentUserVideosPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Unauthenticated");

    const paginatedStories = await ctx.db
      .query("stories")
      .withIndex("by_userId_and_teamId", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const videosByStory = await Promise.all(
      paginatedStories.page.map((s) =>
        ctx.db
          .query("videos")
          .withIndex("storyId", (q) => q.eq("storyId", s._id))
          .order("desc")
          .collect(),
      ),
    );

    const videos = videosByStory.reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

    return { ...paginatedStories, page: videos };
  },
});

export const isCanCreateVideo = internalQuery({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.videoId);
    const videoSegments = await ctx.db
      .query("videoSegments")
      .withIndex("videoId", (q) => q.eq("videoId", args.videoId))
      .collect();
    return (
      videoSegments.length > 1 &&
      videoSegments.every(
        (v) =>
          v.videoStatus.status === "saved" || v.videoStatus.status === "cached",
      )
    );
  },
});
export const editVideoResult = internalMutation({
  args: {
    id: v.id("videos"),
    result: v.union(
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
        videoUrl: v.string(),
        elapsedMs: v.number(),
        publicId: v.string(),
      }),
    ),
  },
  async handler(ctx, args) {
    return await ctx.db.patch(args.id, {
      result: args.result,
    });
  },
});
export const finalVideoGeneratedCallback = httpAction(async (ctx, request) => {
  const data = (await request.json()) as {
    id: Id<"videos">;
    result:
      | {
          status: "failed";
          reason: string;
          elapsedMs: number;
        }
      | {
          status: "saved";
          elapsedMs: number;
          videoUrl: string;
          publicId: string;
        };
  };
  await ctx.runMutation(internal.videos.editVideoResult, {
    id: data.id,
    result: data.result,
  });
  return new Response(null, { status: 200 });
});
export const deleteVideo = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");
    const video = await ctx.runQuery(api.videos.get, { id: args.id });
    if (!video) throw new ConvexError("Video not found");
    // if (video.result.status !== "saved") throw new ConvexError("Video error");
    if (
      !(await ctx.runQuery(internal.videos.isVideoBelongToUser, {
        videoId: args.id,
        userId: userId,
      }))
    )
      throw new ConvexError("Video not found");
    await ctx.db.delete(args.id);
    const videoSegments = await ctx.db
      .query("videoSegments")
      .withIndex("videoId", (q) => q.eq("videoId", args.id))
      .collect();
    const publicIds = videoSegments
      .filter(
        (v) =>
          v.videoStatus.status === "saved" || v.videoStatus.status === "cached",
      )
      .map((v) => (v.videoStatus as { publicId: string }).publicId);
    await Promise.all(
      videoSegments.map(async (s) => {
        await ctx.db.delete(s._id);
      }),
    );
    await ctx.scheduler.runAfter(0, internal.cloudinary.deleteFiles, {
      publicIds,
    });
    return 1;
  },
});
