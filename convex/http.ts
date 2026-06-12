import { httpRouter } from "convex/server";
import { sendImageOptions, sendImagePost } from "./images";
import { auth } from "./auth";
import { voiceGeneratedCallback } from "./voices";
import { segmentVideoGeneratedCallback } from "./videoSegments";
import { finalVideoGeneratedCallback } from "./videos";
import { internal, components } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { registerRoutes } from "@convex-dev/stripe";
import type Stripe from "stripe";

const http = httpRouter();

http.route({
  path: "/sendImage",
  method: "POST",
  handler: sendImagePost,
});
http.route({
  path: "/sendImage",
  method: "OPTIONS",
  handler: sendImageOptions,
});
http.route({
  path: "/voiceGeneratedCallback",
  method: "POST",
  handler: voiceGeneratedCallback,
});
http.route({
  path: "/segmentVideoGeneratedCallback",
  method: "POST",
  handler: segmentVideoGeneratedCallback,
});
http.route({
  path: "/finalVideoGeneratedCallback",
  method: "POST",
  handler: finalVideoGeneratedCallback,
});
http.route({
  path: "/api/auth/youtube",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const stateToken = url.searchParams.get("state");
    if (!code || !stateToken) {
      return new Response(null, {
        status: 403,
      });
    }

    const userId = await ctx.runMutation(internal.youtubeAuth.consumeState, {
      token: stateToken,
    });

    if (!userId) {
      return new Response(null, { status: 403 });
    }

    const { accessToken, refreshToken, expireAt } = await ctx.runAction(
      internal.youtube.processCodeAction,
      {
        code,
      },
    );
    if (!accessToken || !refreshToken || !expireAt)
      return new Response(null, { status: 403 });
    const info = await ctx.runAction(internal.youtube.getChannelInfoAction, {
      accessToken,
      refreshToken,
    });
    await ctx.runMutation(internal.channels.save, {
      channelId: info.id ?? "",
      channelTitle: info.title ?? "Unknown",
      expireAt,
      refreshToken,
      userId,
    });
    return new Response(null, {
      status: 302,
      headers: { Location: `${process.env.SITE_URL}/videos` },
    });
  }),
});

auth.addHttpRoutes(http);

registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
  events: {
    "payment_intent.succeeded": async (
      ctx,
      event: Stripe.PaymentIntentSucceededEvent,
    ) => {
      const payment = event.data.object;
      const metadata = payment.metadata;

      if (metadata.type !== "credit_purchase") return;

      const creditAmount = parseInt(metadata.creditAmount ?? "0");
      if (!creditAmount || isNaN(creditAmount)) return;

      const stripePaymentId = payment.id;
      const userId = metadata.userId as Id<"users">;
      const pack = metadata.pack ?? "unknown";

      if (metadata.targetType === "team" && metadata.teamId) {
        const teamId = metadata.teamId as Id<"teams">;
        await ctx.runMutation(internal.credits.addTeamCredit, {
          teamId,
          userId,
          amount: creditAmount,
          description: `Team credit pack (${pack}) purchase`,
          stripePaymentId,
        });
      } else {
        await ctx.runMutation(internal.credits.addCredit, {
          userId,
          amount: creditAmount,
          type: "purchase",
          description: `Credit pack (${pack}) purchase`,
          stripePaymentId,
        });
      }
    },
    "payment_intent.payment_failed": async (
      ctx,
      event: Stripe.PaymentIntentPaymentFailedEvent,
    ) => {
      const payment = event.data.object;
      const metadata = payment.metadata;
      if (metadata.type === "credit_purchase") {
        await ctx.runMutation(internal.logs.create, {
          function: "stripe_webhook",
          message: `Payment failed for credit purchase: ${payment.id}`,
        });
      }
    },
  },
});

export default http;
