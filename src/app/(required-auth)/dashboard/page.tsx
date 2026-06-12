import { FlickerText } from "@/components/shared/flicker-text";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { cn } from "@/lib/utils";
import {
  Brain,
  Ghost,
  ImageIcon,
  InstagramIcon,
  Mic,
  Music,
  Pen,
  Type,
  UploadIcon,
  Video,
  Youtube,
  Zap,
} from "lucide-react";
import { Hero } from "../_components/hero";
import { StartCraptingButton } from "../_components/start-crapt-button";
export default async function HomePage() {
  return (
    <>
      <Hero>
        <div className="z-10">
          <FlickerText
            text="AI Video Production Platform"
            className={cn(
              "select-none font-amatic text-[50px] font-bold text-purple-300 md:text-[60px] lg:text-[80px]",
            )}
          />
          <p
            className={cn(
              "mx-auto my-10 w-full max-w-[800px] text-center font-jolly text-lg text-gray-300 md:text-2xl lg:text-4xl",
            )}
          >
            Describe an idea or paste a script, and it builds scenes, casts
            characters, generates shots, and scores music — all from one
            interface.
          </p>
          <div className="mx-auto w-fit">
            <StartCraptingButton />
          </div>
          <div
            className={cn(
              "mx-auto my-4 max-w-[500px] text-center font-special text-lg text-gray-300 md:my-12 md:text-2xl",
            )}
          >
            Multi-scene storytelling, fully exportable. From concept to
            production, powered by AI.
          </div>
        </div>
      </Hero>
      <div className="container flex flex-col items-center justify-center py-10 md:py-24">
        <h2
          className={cn(
            "mx-auto my-4 text-center font-nosifer text-lg text-purple-300 md:my-12 md:text-[50px] md:leading-[50px]",
          )}
        >
          AI-Generated Videos
        </h2>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="aspect-video w-full max-w-4xl object-cover"
        >
          <source
            src="https://assets.openstory.so/videos/hero-loop.mp4"
            type="video/mp4"
          />
        </video>
        <h3
          className={cn(
            "my-4 max-w-[600px] text-center font-special text-lg text-gray-300 md:my-12 md:text-2xl",
          )}
        >
          From script to screen — AI builds scenes, characters, shots, and music
          all in one platform.
        </h3>
      </div>
      <div className="container flex flex-col items-center justify-center py-10 md:py-24">
        <h2
          className={cn(
            "mx-auto my-4 text-center font-nosifer text-lg text-purple-300 md:my-12 md:text-[50px] md:leading-[50px]",
          )}
        >
          Create Videos in 3 Easy Steps
        </h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          <Card className="animate-float1 bg-primary p-6 delay-75">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
              <Pen className="h-10 w-10" />
            </div>
            <h3 className="font-special text-xl font-bold text-white">
              1. Write Your Script or Idea
            </h3>
            <p className="font-special text-gray-300">
              Write your own script or let our AI generate a compelling
              narrative for your video project. Supports multi-scene
              storytelling.
            </p>
          </Card>
          <Card className="animate-float2 bg-primary p-6 delay-1000">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
              <Ghost className="h-10 w-10" />
            </div>
            <h3 className="font-special text-xl font-bold text-white">
              2. Generate AI Visuals & Audio
            </h3>
            <p className="font-special text-gray-300">
              Our AI transforms your script into striking visuals and adds
              professional voiceovers perfectly matched to each scene.
            </p>
          </Card>
          <Card className="animate-float3 bg-primary p-6">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
              <Video className="h-10 w-10" />
            </div>
            <h3 className="font-special text-lg font-bold text-white md:text-xl">
              3. Create Professional Videos
            </h3>
            <p className="font-special text-gray-300">
              Combine your script, AI-generated visuals, immersive audio, and
              auto-generated captions to create professional videos ready for
              any platform.
            </p>
          </Card>
        </div>
      </div>
      <div className="container flex flex-col items-center justify-center py-10 md:py-24">
        <h2
          className={cn(
            "mx-auto my-4 text-center font-nosifer text-lg text-purple-300 md:my-12 md:text-[50px] md:leading-[50px]",
          )}
        >
          Powerful Features at Your Fingertips
        </h2>
        <div className="grid gap-x-8 md:grid-cols-3 lg:grid-cols-4">
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                AI Story Generation
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Let our advanced AI craft compelling narratives tailored to your
              preferences.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                High-Quality Visuals
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Generate stunning images that bring your story to life.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                Professional Voiceovers
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Add narration with our AI-powered voice synthesis technology.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Video className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                Seamless Video Creation
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Automatically combine your story, images, and audio into a
              captivating video.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Type className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                Auto-Generated Captions
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Ensure accessibility and engagement with accurate, timed captions.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Music className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                Background Music
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Set the mood with our library of soundtracks and effects.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <UploadIcon className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                Easy Social Sharing
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Instantly share your video creations across multiple platforms.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Youtube className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                YouTube Integration
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Seamlessly upload to your YouTube channel directly from the
              platform.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                Fast Processing
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Generate your professional videos in minutes, not hours.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <InstagramIcon className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                TikTok-Ready Format
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Create vertical videos optimized for TikTok&apos;s viral
              potential.
            </p>
          </Card>
          <Card className="mb-8 bg-primary p-6 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                <InstagramIcon className="h-5 w-5" />
              </div>
              <h3 className="font-special text-xl font-bold text-white">
                Instagram Stories
              </h3>
            </div>
            <p className="mt-3 font-special text-gray-300">
              Generate content perfect for Instagram Stories and Reels.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
