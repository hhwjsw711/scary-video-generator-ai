import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // other "users" fields...
    credits: v.number(),
  }).index("email", ["email"]),

  teams: defineTable({
    name: v.string(),
    description: v.string(),
    ownerId: v.id("users"),
    credits: v.number(),
  }).index("by_ownerId", ["ownerId"]),

  teamMembers: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
  })
    .index("by_teamId", ["teamId"])
    .index("by_userId", ["userId"])
    .index("by_teamId_and_userId", ["teamId", "userId"]),
  stories: defineTable({
    name: v.string(),
    userId: v.id("users"),
    teamId: v.optional(v.id("teams")),
    content: v.string(),
    createType: v.union(
      v.literal("full-scripted"),
      v.literal("by-segments"),
      v.literal("by-ai"),
    ),
    styleId: v.optional(v.string()),
    AIGenerateInfo: v.optional(
      v.object({
        prompt: v.string(),
        finishedRefine: v.boolean(),
        status: v.union(
          v.object({
            state: v.literal("pending"),
          }),
          v.object({
            state: v.literal("failed"),
            reason: v.string(),
          }),
          v.object({
            state: v.literal("saved"),
          }),
        ),
      }),
    ),
    format: v.optional(v.union(v.literal("16:9"), v.literal("9:16"))),
    context: v.optional(
      v.union(
        v.object({
          state: v.literal("pending"),
        }),
        v.object({
          state: v.literal("failed"),
          reason: v.string(),
        }),
        v.object({
          state: v.literal("saved"),
          data: v.string(),
        }),
      ),
    ),
  })
    .index("by_teamId", ["teamId"])
    .index("by_userId_and_teamId", ["userId", "teamId"]),
  storySegments: defineTable({
    text: v.string(),
    imagePrompt: v.string(),
    storyId: v.id("stories"),
    order: v.number(),
    imageStatus: v.union(
      v.object({
        status: v.literal("idle"),
      }),
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
  }).index("storyId", ["storyId"]),
  logs: defineTable({
    messsage: v.string(),
    function: v.string(),
    additionals: v.optional(v.any()),
  }),
  videos: defineTable({
    storyId: v.id("stories"),
    name: v.string(),
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
        publicId: v.string(),
        videoUrl: v.string(),
        elapsedMs: v.number(),
      }),
    ),
  }).index("storyId", ["storyId"]),
  videoSegments: defineTable({
    videoId: v.id("videos"),
    text: v.string(),
    imagePrompt: v.string(),
    imageUrl: v.string(),
    order: v.number(),
    voiceStatus: v.union(
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
        publicId: v.string(),
        voiceDuration: v.number(),
        voiceUrl: v.string(),
        voiceSrt: v.string(),
        elapsedMs: v.number(),
      }),
      v.object({
        status: v.literal("cached"),
        publicId: v.string(),
        voiceDuration: v.number(),
        voiceUrl: v.string(),
        voiceSrt: v.string(),
      }),
    ),

    videoStatus: v.union(
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
        publicId: v.string(),
        status: v.literal("saved"),
        videoUrl: v.string(),
        elapsedMs: v.number(),
      }),
      v.object({
        publicId: v.string(),
        status: v.literal("cached"),
        videoUrl: v.string(),
      }),
    ),
  }).index("videoId", ["videoId"]),

  channels: defineTable({
    refreshToken: v.string(),
    userId: v.id("users"),
    expireAt: v.number(),
    channelId: v.string(),
    channelTitle: v.string(),
  }).index("userId", ["userId"]),

  talents: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    isHuman: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
  }).index("userId", ["userId"]),

  talentSheets: defineTable({
    talentId: v.id("talents"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    imagePublicId: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
    source: v.optional(
      v.union(v.literal("manual_upload"), v.literal("ai_generated")),
    ),
  }).index("talentId", ["talentId"]),

  talentMedia: defineTable({
    talentId: v.id("talents"),
    type: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("recording"),
    ),
    url: v.string(),
    publicId: v.optional(v.string()),
  }).index("talentId", ["talentId"]),

  creditTransactions: defineTable({
    userId: v.id("users"),
    teamId: v.optional(v.id("teams")),
    amount: v.number(),
    type: v.union(
      v.literal("purchase"),
      v.literal("consumption"),
      v.literal("signup_bonus"),
      v.literal("refund"),
    ),
    description: v.string(),
    stripePaymentId: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_teamId", ["teamId"]),
});

export default schema;
