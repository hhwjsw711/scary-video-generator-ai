"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((mod) => ({ default: mod.HeroCanvas })),
  { ssr: false, loading: () => null },
);

export const Hero = ({ children }: { children: React.ReactNode }) => {
  const container = useRef(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    void (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {}, container);
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div
      ref={container}
      className="relative flex min-h-[500px] flex-col items-center py-10 md:min-h-[600px] md:py-24"
    >
      <div className="absolute inset-0 h-full w-full bg-background">
        <HeroCanvas />
      </div>
      {children}
    </div>
  );
};
