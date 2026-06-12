import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

export const create = internalMutation({
  args: {
    message: v.string(),
    function: v.string(),
    additionals: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("logs", {
      message: args.message,
      function: args.function,
      additionals: args.additionals,
    });
  },
});
