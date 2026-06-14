"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { CodeInput } from "./CodeInput";
import { Loader2, ArrowLeft } from "lucide-react";

export function ResetPasswordWithEmailCode({
  onBack,
  onSuccess,
  provider = "password",
}: {
  onBack: () => void;
  onSuccess?: () => void;
  provider?: string;
}) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [step, setStep] = useState<"email" | { email: string }>("email");
  const [submitting, setSubmitting] = useState(false);

  if (step === "email") {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-kecal text-sm text-gray-400">
          Enter your email address and we'll send you a code to reset your
          password.
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitting(true);
            const formData = new FormData(event.currentTarget);
            formData.set("flow", "reset");
            signIn(provider, formData)
              .then(() => {
                setStep({ email: formData.get("email") as string });
                setSubmitting(false);
              })
              .catch((error) => {
                console.error(error);
                toast({
                  title: "Could not send reset code. Check the email address.",
                  variant: "destructive",
                });
                setSubmitting(false);
              });
          }}
        >
          <div className="space-y-2">
            <label
              htmlFor="reset-email"
              className="font-kecal text-sm text-purple-300"
            >
              Email
            </label>
            <Input
              name="email"
              id="reset-email"
              type="email"
              placeholder="your@email.com"
              className="border-purple-700 bg-gray-900 text-white placeholder:text-gray-500"
              autoComplete="email"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary py-2 font-kecal text-white hover:bg-primary/90"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send Reset Code"
            )}
          </Button>

          <Button
            variant="link"
            type="button"
            className="font-kecal text-sm text-purple-400"
            onClick={onBack}
          >
            Back to sign in
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-kecal text-sm text-gray-400">
        Enter the 8-digit code sent to {step.email} and choose a new password.
      </p>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitting(true);
          const formData = new FormData(event.currentTarget);
          formData.set("flow", "reset-verification");
          formData.set("email", step.email);
          signIn(provider, formData)
            .then(() => onSuccess?.())
            .catch((error) => {
              console.error(error);
              toast({
                title: "Invalid code or password. Please try again.",
                variant: "destructive",
              });
              setSubmitting(false);
            });
        }}
      >
        <div className="space-y-2">
          <label
            htmlFor="code"
            className="font-kecal text-sm text-purple-300"
          >
            Verification Code
          </label>
          <CodeInput />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="new-password"
            className="font-kecal text-sm text-purple-300"
          >
            New Password
          </label>
          <Input
            type="password"
            name="newPassword"
            id="new-password"
            placeholder="At least 6 characters"
            className="border-purple-700 bg-gray-900 text-white placeholder:text-gray-500"
            autoComplete="new-password"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary py-2 font-kecal text-white hover:bg-primary/90"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Reset Password"
          )}
        </Button>

        <Button
          variant="link"
          type="button"
          className="font-kecal text-sm text-purple-400"
          onClick={() => setStep("email")}
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Send code to a different email
        </Button>
      </form>
    </div>
  );
}
