import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

export const getTalents = query({
  args: {
    favoritesOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    let talents = await ctx.db
      .query("talents")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    if (args.favoritesOnly) {
      talents = talents.filter((t) => t.isFavorite);
    }

    return Promise.all(
      talents.map(async (talent) => {
        const sheets = await ctx.db
          .query("talentSheets")
          .filter((q) => q.eq(q.field("talentId"), talent._id))
          .collect();
        const media = await ctx.db
          .query("talentMedia")
          .filter((q) => q.eq(q.field("talentId"), talent._id))
          .collect();
        return { ...talent, sheets, media };
      }),
    );
  },
});

export const getTalentById = query({
  args: { id: v.id("talents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.id);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    const sheets = await ctx.db
      .query("talentSheets")
      .filter((q) => q.eq(q.field("talentId"), talent._id))
      .collect();
    const media = await ctx.db
      .query("talentMedia")
      .filter((q) => q.eq(q.field("talentId"), talent._id))
      .collect();

    return { ...talent, sheets, media };
  },
});

export const createTalent = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isHuman: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talentId = await ctx.db.insert("talents", {
      userId,
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      isFavorite: false,
      isHuman: args.isHuman ?? false,
      isPublic: args.isPublic ?? false,
    });

    return talentId;
  },
});

export const updateTalent = mutation({
  args: {
    id: v.id("talents"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isHuman: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.id);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    const updateFields: Partial<Doc<"talents">> = {};
    if (args.name !== undefined) updateFields.name = args.name;
    if (args.description !== undefined)
      updateFields.description = args.description;
    if (args.imageUrl !== undefined) updateFields.imageUrl = args.imageUrl;
    if (args.isHuman !== undefined) updateFields.isHuman = args.isHuman;
    if (args.isPublic !== undefined) updateFields.isPublic = args.isPublic;

    await ctx.db.patch(args.id, updateFields);
    return args.id;
  },
});

export const deleteTalent = mutation({
  args: { id: v.id("talents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.id);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    const sheets = await ctx.db
      .query("talentSheets")
      .filter((q) => q.eq(q.field("talentId"), args.id))
      .collect();
    for (const sheet of sheets) {
      await ctx.db.delete(sheet._id);
    }

    const media = await ctx.db
      .query("talentMedia")
      .filter((q) => q.eq(q.field("talentId"), args.id))
      .collect();
    for (const m of media) {
      await ctx.db.delete(m._id);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const toggleTalentFavorite = mutation({
  args: { id: v.id("talents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.id);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    await ctx.db.patch(args.id, {
      isFavorite: !talent.isFavorite,
    });
    return args.id;
  },
});

export const addTalentMedia = mutation({
  args: {
    talentId: v.id("talents"),
    type: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("recording"),
    ),
    url: v.string(),
    publicId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.talentId);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    const mediaId = await ctx.db.insert("talentMedia", {
      talentId: args.talentId,
      type: args.type,
      url: args.url,
      publicId: args.publicId,
    });

    return mediaId;
  },
});

export const deleteTalentMedia = mutation({
  args: { id: v.id("talentMedia") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const media = await ctx.db.get(args.id);
    if (!media) throw new ConvexError("Media not found");

    const talent = await ctx.db.get(media.talentId);
    if (!talent || talent.userId !== userId) throw new ConvexError("Forbidden");

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const addTalentSheet = mutation({
  args: {
    talentId: v.id("talents"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    imagePublicId: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
    source: v.optional(
      v.union(v.literal("manual_upload"), v.literal("ai_generated")),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.talentId);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    if (args.isDefault) {
      const existingSheets = await ctx.db
        .query("talentSheets")
        .filter((q) => q.eq(q.field("talentId"), args.talentId))
        .collect();
      for (const sheet of existingSheets) {
        await ctx.db.patch(sheet._id, { isDefault: false });
      }
    }

    const sheetId = await ctx.db.insert("talentSheets", {
      talentId: args.talentId,
      name: args.name,
      imageUrl: args.imageUrl,
      imagePublicId: args.imagePublicId,
      isDefault: args.isDefault ?? false,
      source: args.source ?? "manual_upload",
    });

    return sheetId;
  },
});

export const setDefaultSheet = mutation({
  args: {
    sheetId: v.id("talentSheets"),
    talentId: v.id("talents"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const talent = await ctx.db.get(args.talentId);
    if (!talent) throw new ConvexError("Talent not found");
    if (talent.userId !== userId) throw new ConvexError("Forbidden");

    const allSheets = await ctx.db
      .query("talentSheets")
      .filter((q) => q.eq(q.field("talentId"), args.talentId))
      .collect();

    for (const sheet of allSheets) {
      await ctx.db.patch(sheet._id, {
        isDefault: sheet._id === args.sheetId,
      });
    }

    return args.sheetId;
  },
});

export const deleteTalentSheet = mutation({
  args: { id: v.id("talentSheets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Unauthenticated");

    const sheet = await ctx.db.get(args.id);
    if (!sheet) throw new ConvexError("Sheet not found");

    const talent = await ctx.db.get(sheet.talentId);
    if (!talent || talent.userId !== userId) throw new ConvexError("Forbidden");

    await ctx.db.delete(args.id);
    return args.id;
  },
});
