"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { HeroCanvas } from "@/app/(required-auth)/_components/hero-canvas";

const ROTATING_WORDS = [
  "Films",
  "Stories",
  "Movies",
  "Shorts",
  "Ads",
  "Content",
];

export function HeroSection() {
  const handleScrollToVideo = () => {
    document
      .getElementById("video-showcase")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-20 md:min-h-screen md:py-32">
      <div className="absolute inset-0 h-full w-full">
        <HeroCanvas />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/90" />

      <div className="z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-700/50 bg-purple-900/20 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
          </span>
          <span className="font-kecal text-xs text-purple-300 md:text-sm">
            Now in Public Beta
          </span>
        </div>

        <h1 className="mb-4 font-kecal text-3xl leading-tight text-purple-300 md:text-5xl lg:text-7xl">
          Turn Ideas Into
        </h1>

        <div className="relative mb-8 h-[1.2em] w-full overflow-hidden">
          {ROTATING_WORDS.map((word, i) => (
            <span
              key={word}
              className="absolute inset-0 whitespace-nowrap font-kecal text-3xl text-white opacity-0 md:text-5xl lg:text-7xl"
              style={{
                animation: `wordCycle 18s ease-in-out infinite`,
                animationDelay: `${i * 3}s`,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        <p className="mx-auto mb-10 max-w-2xl font-kecal text-base leading-relaxed text-gray-300 md:text-xl">
          Describe an idea or paste a script, and our AI builds scenes, casts
          characters, generates shots, and scores music — all from one
          interface. Multi-scene, fully exportable.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/generate">
            <Button
              variant="default"
              size="lg"
              className="group px-8 py-6 font-kecal text-[24px]"
            >
              Start Creating Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            className="gap-2 font-kecal text-purple-300 hover:bg-purple-900/20 hover:text-white"
            onClick={handleScrollToVideo}
          >
            <Play className="h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        <p className="mt-6 font-kecal text-sm text-purple-400/60">
          No credit card required · Start with 1,000 free credits
        </p>
      </div>

      <style>{`
        @keyframes wordCycle {
          0%, 2% { opacity: 0; transform: translateY(0.5em); }
          4%, 14% { opacity: 1; transform: translateY(0); }
          16%, 100% { opacity: 0; transform: translateY(-0.5em); }
        }
      `}</style>
    </section>
  );
}
