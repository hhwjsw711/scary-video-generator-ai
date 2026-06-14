"use client";
import { cn } from "@/lib/utils";
import { AlignJustifyIcon, PenIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

const CreateYourStory = () => {
  return (
    <div className="py-32">
      <h1
        className={cn(
          "mb-4 text-center font-kecal text-4xl font-[700] text-purple-300",
        )}
      >
        Create Your Video
      </h1>
      <p className={cn("mb-8 text-center font-kecal text-lg text-gray-300")}>
        Describe an idea or paste a script — we build scenes, characters, shots,
        and music.
      </p>

      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-center gap-4 font-kecal text-white md:flex-row md:gap-8",
        )}
      >
        <Link
          href="/generate/script"
          className="flex h-40 w-full max-w-[200px] flex-col items-center justify-center rounded-lg bg-primary p-4 transition-colors hover:bg-primary-foreground md:h-52 md:w-52 md:p-6"
        >
          <div className="mb-4 text-5xl">
            <PenIcon className="h-14 w-14" />
          </div>
          <p className="text-center font-semibold">I have a script ready</p>
        </Link>
        <Link
          href="/generate/segment"
          className="flex h-40 w-full max-w-[200px] flex-col items-center justify-center rounded-lg bg-primary p-4 transition-colors hover:bg-primary-foreground md:h-52 md:w-52 md:p-6"
        >
          <div className="mb-4 text-5xl">
            <AlignJustifyIcon className="h-14 w-14" />
          </div>
          <p className="text-center font-semibold">
            I want to create my story segment by segment
          </p>
        </Link>
        <Link
          href="/generate/guided"
          className="flex h-40 w-full max-w-[200px] flex-col items-center justify-center rounded-lg bg-primary p-4 transition-colors hover:bg-primary-foreground md:h-52 md:w-52 md:p-6"
        >
          <div className="mb-4 text-5xl">
            <SparklesIcon className="h-14 w-14" />
          </div>
          <p className="text-center font-semibold">
            Guide me through story creation
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CreateYourStory;
