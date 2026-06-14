import { FlickerText } from "@/components/shared/flicker-text";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Ghost, Pen, Video } from "lucide-react";
import { Hero } from "../_components/hero";
import { StartCraptingButton } from "../_components/start-crapt-button";
import { FeaturesGrid } from "@/components/landing/features-grid";
export default async function HomePage() {
  return (
    <>
      <Hero>
        <div className="z-10">
          <FlickerText
            text="AI Video Production Platform"
            className={cn(
              "select-none font-kecal text-[50px] font-bold text-purple-300 md:text-[60px] lg:text-[80px]",
            )}
          />
          <p
            className={cn(
              "mx-auto my-10 w-full max-w-[800px] text-center font-kecal text-lg text-gray-300 md:text-2xl lg:text-4xl",
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
              "mx-auto my-4 max-w-[500px] text-center font-kecal text-lg text-gray-300 md:my-12 md:text-2xl",
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
            "mx-auto my-4 text-center font-kecal text-lg text-purple-300 md:my-12 md:text-[50px] md:leading-[50px]",
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
            "my-4 max-w-[600px] text-center font-kecal text-lg text-gray-300 md:my-12 md:text-2xl",
          )}
        >
          From script to screen — AI builds scenes, characters, shots, and music
          all in one platform.
        </h3>
      </div>
      <div className="container flex flex-col items-center justify-center py-10 md:py-24">
        <h2
          className={cn(
            "mx-auto my-4 text-center font-kecal text-lg text-purple-300 md:my-12 md:text-[50px] md:leading-[50px]",
          )}
        >
          Create Videos in 3 Easy Steps
        </h2>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          <Card className="animate-float1 bg-primary p-6 delay-75">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
              <Pen className="h-10 w-10" />
            </div>
            <h3 className="font-kecal text-xl font-bold text-white">
              1. Write Your Script or Idea
            </h3>
            <p className="font-kecal text-gray-300">
              Write your own script or let our AI generate a compelling
              narrative for your video project. Supports multi-scene
              storytelling.
            </p>
          </Card>
          <Card className="animate-float2 bg-primary p-6 delay-1000">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
              <Ghost className="h-10 w-10" />
            </div>
            <h3 className="font-kecal text-xl font-bold text-white">
              2. Generate AI Visuals & Audio
            </h3>
            <p className="font-kecal text-gray-300">
              Our AI transforms your script into striking visuals and adds
              professional voiceovers perfectly matched to each scene.
            </p>
          </Card>
          <Card className="animate-float3 bg-primary p-6">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
              <Video className="h-10 w-10" />
            </div>
            <h3 className="font-kecal text-lg font-bold text-white md:text-xl">
              3. Create Professional Videos
            </h3>
            <p className="font-kecal text-gray-300">
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
            "mx-auto my-4 text-center font-kecal text-lg text-purple-300 md:my-12 md:text-[50px] md:leading-[50px]",
          )}
        >
          Powerful Features at Your Fingertips
        </h2>
        <FeaturesGrid />
      </div>
    </>
  );
}
