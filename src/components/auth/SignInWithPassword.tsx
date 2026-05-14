"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SignInWithPassword({
  provider = "password",
  onSuccess,
  onForgotPassword,
}: {
  provider?: string;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn(provider, formData)
          .then(() => onSuccess?.())
          .catch((error) => {
            console.error(error);
            const toastTitle =
              flow === "signIn"
                ? "Could not sign in, did you mean to sign up?"
                : "Could not sign up, did you mean to sign in?";
            toast({ title: toastTitle, variant: "destructive" });
            setSubmitting(false);
          });
      }}
    >
      <div className="space-y-2">
        <label htmlFor="email" className="font-special text-sm text-purple-300">
          Email
        </label>
        <Input
          name="email"
          id="email"
          placeholder="your@email.com"
          className="border-purple-700 bg-gray-900 text-white placeholder:text-gray-500"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="font-special text-sm text-purple-300"
          >
            Password
          </label>
          {flow === "signIn" && onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-special text-xs text-purple-400 hover:text-purple-300"
            >
              Forgot password?
            </button>
          )}
        </div>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="At least 6 characters"
          className="border-purple-700 bg-gray-900 text-white placeholder:text-gray-500"
          autoComplete={flow === "signIn" ? "current-password" : "new-password"}
          required
        />
      </div>

      {flow === "signUp" && (
        <p className="font-special text-xs text-gray-400">
          Password must be at least 6 characters.
        </p>
      )}

      <input name="flow" value={flow} type="hidden" />

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary py-2 font-special text-white hover:bg-primary/90"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : flow === "signIn" ? (
          "Sign In"
        ) : (
          "Sign Up"
        )}
      </Button>

      <Button
        variant="link"
        type="button"
        className={cn(
          "font-special text-sm text-purple-400",
          submitting && "pointer-events-none opacity-50",
        )}
        onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
      >
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
}
