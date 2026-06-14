import { cn } from "@/lib/utils";

function SkeletonCard() {
  return (
    <div className="mb-8 animate-pulse rounded-lg bg-primary/30 p-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-full bg-white/10" />
        <div className="h-5 w-32 rounded bg-white/10" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="animate-pulse border-b border-purple-700 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="h-8 w-28 rounded bg-purple-700/30" />
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-purple-700/30" />
          <div className="h-10 w-10 rounded bg-purple-700/30" />
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative flex min-h-[500px] animate-pulse flex-col items-center py-10 md:min-h-[600px] md:py-24">
      <div className="absolute inset-0 h-full w-full bg-background" />
      <div className="z-10 flex flex-col items-center gap-6">
        <div className="h-16 w-96 rounded bg-purple-700/30 md:h-20 md:w-[600px]" />
        <div className="h-8 w-80 rounded bg-white/10 md:h-10 md:w-[600px]" />
        <div className="mt-4 h-14 w-48 rounded bg-primary/50" />
        <div className="h-6 w-64 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <div className="md:hidden">
        <HeaderSkeleton />
      </div>
      <HeroSkeleton />
      <div className="container py-10 md:py-24">
        <div
          className={cn(
            "mx-auto mb-12 h-10 w-80 animate-pulse rounded bg-white/10 md:h-[50px] md:w-[400px]",
          )}
        />
        <div className="grid gap-x-8 md:grid-cols-3 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </>
  );
}
