import { convexAuth } from "@convex-dev/auth/server";
import Google, { GoogleProfile } from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { ResendOTPPasswordReset } from "./otp/ResendOTPPasswordReset";
import { DataModel } from "./_generated/dataModel.js";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password<DataModel>({
      id: "password",
      reset: ResendOTPPasswordReset,
      profile(params) {
        return {
          email: params.email as string,
          credits: 1000,
        };
      },
    }),
    Google({
      profile(googleProfile: GoogleProfile) {
        return {
          email: googleProfile.email,
          id: googleProfile.sub,
          image: googleProfile.picture,
          name: googleProfile.name,
          credits: 1000,
        };
      },
    }),
  ],
});
