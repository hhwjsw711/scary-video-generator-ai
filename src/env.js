import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    OPENAI_API_KEY: z.string().min(1),
    REPLICATE_API_TOKEN: z.string().min(1),
    CONVEX_DEPLOYMENT: z.string().min(1),
    CLOUDINARY_URL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    YOUTUBE_CLIENT_ID: z.string().min(1),
    YOUTUBE_CLIENT_SECRET: z.string().min(1),
    YOUTUBE_REDIRECT_URI: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_QUEUE_GENERATE_VOICE: z.string().min(1),
    AWS_QUEUE_GENERATE_FINAL_VIDEO: z.string().min(1),
    ENCRYPTION_KEY: z
      .string()
      .min(64, "Must be at least 64 hex chars (256-bit)"),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_QUEUE_GENERATE_VOICE: process.env.AWS_QUEUE_GENERATE_VOICE,
    AWS_QUEUE_GENERATE_FINAL_VIDEO: process.env.AWS_QUEUE_GENERATE_FINAL_VIDEO,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV !== "production",
  emptyStringAsUndefined: true,
});
