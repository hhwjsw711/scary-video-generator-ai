"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  credits: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const TIERS: PricingTier[] = [
  {
    name: "Starter",
    credits: 1000,
    description: "Perfect for trying out AI video generation",
    features: [
      "1 full video generation",
      "15 visual styles",
      "YouTube export",
      "Basic voiceovers",
    ],
  },
  {
    name: "Pro",
    credits: 3500,
    description: "For creators making content regularly",
    features: [
      "3-4 full video generations",
      "All 15 visual styles",
      "Priority processing",
      "HD voiceovers",
      "Team collaboration",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    credits: 15000,
    description: "For teams and agencies scaling production",
    features: [
      "15+ full video generations",
      "All 15 visual styles",
      "Fastest processing",
      "Premium voiceovers",
      "Team management",
      "Shared credit pool",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-nosifer text-2xl text-purple-300 md:text-[50px] md:leading-[50px]">
          Simple Credit Pricing
        </h2>
        <p className="mt-4 font-special text-base text-gray-400 md:text-lg">
          Pay only for what you need. Every new account starts with{" "}
          <span className="text-purple-300">1,000 free credits</span> to create
          your first video.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative flex flex-col rounded-xl border p-6 transition-all duration-300",
              tier.highlighted
                ? "border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-900/20"
                : "border-purple-700/30 bg-purple-900/10 hover:border-purple-500/50",
            )}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 rounded-full bg-purple-500 px-4 py-1">
                <span className="font-special text-xs font-bold text-white">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-special text-xl font-bold text-white">
                {tier.name}
              </h3>
              <p className="mt-1 font-special text-sm text-gray-400">
                {tier.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <Zap className="h-5 w-5 text-purple-400" />
                <span className="font-nosifer text-3xl text-purple-300">
                  {tier.credits.toLocaleString()}
                </span>
              </div>
              <span className="font-special text-sm text-gray-500">
                credits
              </span>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 font-special text-sm text-gray-300"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/billing">
              <Button
                variant={tier.highlighted ? "default" : "outline"}
                className={cn(
                  "w-full font-special",
                  !tier.highlighted &&
                    "border-purple-700 text-purple-300 hover:bg-purple-900/20 hover:text-white",
                )}
              >
                Get Started
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
