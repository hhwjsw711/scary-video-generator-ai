import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { PasswordResetEmail } from "./PasswordResetEmail";

function generateCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => (b % 10).toString()).join("");
}

export const ResendOTPPasswordReset = Email({
  id: "resend-otp-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY!,
  async generateVerificationToken() {
    return generateCode();
  },
  async sendVerificationRequest({
    identifier: email,
    provider,
    token,
    expires,
  }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL ?? "Wordream <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password in Wordream",
      react: PasswordResetEmail({ code: token, expires }),
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
