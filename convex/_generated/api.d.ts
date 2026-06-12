/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as channels from "../channels.js";
import type * as chatgpt from "../chatgpt.js";
import type * as cloudinary from "../cloudinary.js";
import type * as constants from "../constants.js";
import type * as credits from "../credits.js";
import type * as crypto from "../crypto.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as logs from "../logs.js";
import type * as otp_PasswordResetEmail from "../otp/PasswordResetEmail.js";
import type * as otp_ResendOTPPasswordReset from "../otp/ResendOTPPasswordReset.js";
import type * as ratelimit from "../ratelimit.js";
import type * as replicate from "../replicate.js";
import type * as sqs from "../sqs.js";
import type * as storage from "../storage.js";
import type * as stories from "../stories.js";
import type * as storySegments from "../storySegments.js";
import type * as stripe from "../stripe.js";
import type * as styles from "../styles.js";
import type * as talent from "../talent.js";
import type * as teamMembers from "../teamMembers.js";
import type * as teams from "../teams.js";
import type * as users from "../users.js";
import type * as videoSegments from "../videoSegments.js";
import type * as videos from "../videos.js";
import type * as voices from "../voices.js";
import type * as youtube from "../youtube.js";
import type * as youtubeAuth from "../youtubeAuth.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  channels: typeof channels;
  chatgpt: typeof chatgpt;
  cloudinary: typeof cloudinary;
  constants: typeof constants;
  credits: typeof credits;
  crypto: typeof crypto;
  helpers: typeof helpers;
  http: typeof http;
  images: typeof images;
  logs: typeof logs;
  "otp/PasswordResetEmail": typeof otp_PasswordResetEmail;
  "otp/ResendOTPPasswordReset": typeof otp_ResendOTPPasswordReset;
  ratelimit: typeof ratelimit;
  replicate: typeof replicate;
  sqs: typeof sqs;
  storage: typeof storage;
  stories: typeof stories;
  storySegments: typeof storySegments;
  stripe: typeof stripe;
  styles: typeof styles;
  talent: typeof talent;
  teamMembers: typeof teamMembers;
  teams: typeof teams;
  users: typeof users;
  videoSegments: typeof videoSegments;
  videos: typeof videos;
  voices: typeof voices;
  youtube: typeof youtube;
  youtubeAuth: typeof youtubeAuth;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  stripe: import("@convex-dev/stripe/_generated/component.js").ComponentApi<"stripe">;
};
