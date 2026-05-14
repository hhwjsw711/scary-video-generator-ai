"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CodeInput({ className }: { className?: string }) {
  return (
    <Input
      name="code"
      type="text"
      inputMode="numeric"
      placeholder="Enter 8-digit code"
      className={cn(
        "border-purple-700 bg-gray-900 text-center text-lg tracking-[0.5em] text-white placeholder:tracking-normal",
        className,
      )}
      autoComplete="one-time-code"
      required
    />
  );
}
