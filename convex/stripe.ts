import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { action, query } from "./_generated/server";
import { api, components } from "./_generated/api";

import { StripeSubscriptions } from "@convex-dev/stripe";

const stripeClient = new StripeSubscriptions(components.stripe, {});

export const CREDIT_PACKS = {
  starter: {
    label: "Starter",
    credits: 1000,
    priceId: process.env.STRIPE_PRICE_STARTER ?? "",
  },
  pro: {
    label: "Pro",
    credits: 3500,
    priceId: process.env.STRIPE_PRICE_PRO ?? "",
  },
  team: {
    label: "Team",
    credits: 15000,
    priceId: process.env.STRIPE_PRICE_TEAM ?? "",
  },
} as const;

function getSiteUrl() {
  return process.env.SITE_URL ?? "http://localhost:3000";
}

export const createCreditCheckout = action({
  args: {
    pack: v.union(
      v.literal("starter"),
      v.literal("pro"),
      v.literal("team"),
    ),
    targetType: v.union(v.literal("personal"), v.literal("team")),
    teamId: v.optional(v.id("teams")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("No identity found");

    const pack = CREDIT_PACKS[args.pack];
    if (!pack.priceId) {
      throw new ConvexError(`Price ID not configured for pack: ${args.pack}`);
    }

    if (args.targetType === "team") {
      if (!args.teamId) {
        throw new ConvexError("teamId is required for team purchases");
      }
      const team = await ctx.runQuery(api.teams.get, { teamId: args.teamId });
      if (!team) {
        throw new ConvexError("You are not a member of this team");
      }
      if (team.role !== "admin") {
        throw new ConvexError("Only team admins can purchase credits for the team");
      }
    }

    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId,
      email: identity.email,
      name: identity.name,
    });

    return await stripeClient.createCheckoutSession(ctx, {
      priceId: pack.priceId,
      customerId: customer.customerId,
      mode: "payment",
      successUrl: `${getSiteUrl()}/billing?success=true`,
      cancelUrl: `${getSiteUrl()}/billing?canceled=true`,
      quantity: 1,
      paymentIntentMetadata: {
        userId,
        type: "credit_purchase",
        creditAmount: String(pack.credits),
        targetType: args.targetType,
        ...(args.targetType === "team" && args.teamId
          ? { teamId: args.teamId }
          : {}),
        pack: args.pack,
      },
    });
  },
});

export const createCustomerPortal = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("No identity found");

    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId,
      email: identity.email,
      name: identity.name,
    });

    return await stripeClient.createCustomerPortalSession(ctx, {
      customerId: customer.customerId,
      returnUrl: `${getSiteUrl()}/billing`,
    });
  },
});

export const getCreditPacks = query({
  args: {},
  handler: async () => {
    return Object.entries(CREDIT_PACKS).map(([key, pack]) => ({
      key,
      label: pack.label,
      credits: pack.credits,
      priceId: pack.priceId,
    }));
  },
});
