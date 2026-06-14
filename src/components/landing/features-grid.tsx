"use client";

import { Card } from "@/components/ui/card";
import { FadeInSection } from "@/components/shared/fade-in-section";
import {
  Brain,
  ImageIcon,
  InstagramIcon,
  Mic,
  Music,
  Type,
  UploadIcon,
  Video,
  Youtube,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Story Generation",
    desc: "Let our advanced AI craft compelling narratives tailored to your preferences.",
  },
  {
    icon: ImageIcon,
    title: "High-Quality Visuals",
    desc: "Generate stunning images that bring your story to life.",
  },
  {
    icon: Mic,
    title: "Professional Voiceovers",
    desc: "Add narration with our AI-powered voice synthesis technology.",
  },
  {
    icon: Video,
    title: "Seamless Video Creation",
    desc: "Automatically combine your story, images, and audio into a captivating video.",
  },
  {
    icon: Type,
    title: "Auto-Generated Captions",
    desc: "Ensure accessibility and engagement with accurate, timed captions.",
  },
  {
    icon: Music,
    title: "Background Music",
    desc: "Set the mood with our library of soundtracks and effects.",
  },
  {
    icon: UploadIcon,
    title: "Easy Social Sharing",
    desc: "Instantly share your video creations across multiple platforms.",
  },
  {
    icon: Youtube,
    title: "YouTube Integration",
    desc: "Seamlessly upload to your YouTube channel directly from the platform.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    desc: "Generate your professional videos in minutes, not hours.",
  },
  {
    icon: InstagramIcon,
    title: "TikTok-Ready Format",
    desc: "Create vertical videos optimized for TikTok's viral potential.",
  },
  {
    icon: InstagramIcon,
    title: "Instagram Stories",
    desc: "Generate content perfect for Instagram Stories and Reels.",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid gap-x-8 md:grid-cols-3 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, desc }, i) => (
        <FadeInSection key={title} delay={i * 60}>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="mt-3 text-gray-300">{desc}</p>
          </Card>
        </FadeInSection>
      ))}
    </div>
  );
}
