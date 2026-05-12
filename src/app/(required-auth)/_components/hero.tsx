"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { HeroCanvas } from "./hero-canvas";
gsap.registerPlugin(ScrollTrigger);
export const Hero = ({ children }: { children: React.ReactNode }) => {
  const container = useRef(null);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      // Animation logic can be added here if needed
    }, container);
    return () => context.revert();
  }, []);
  return (
    <div
      ref={container}
      className="relative flex min-h-[500px] flex-col items-center py-10 md:min-h-[600px] md:py-24"
    >
      <div className="absolute inset-0 h-full w-full">
        <HeroCanvas />
      </div>
      {children}
    </div>
  );
};
