"use client";
import { AuthLoader } from "@/components/shared/auth-loader";
import { cn } from "@/lib/utils";
import { usePaginatedQuery, useQuery } from "convex/react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { api } from "~/convex/_generated/api";
import { ChannelItem } from "@/components/videos/channel-item";
import { ConnectYoutubeButton } from "@/components/videos/connect-youtube-button";
import { VideoItem } from "@/components/videos/video-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function AuthLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="h-[200px]" key={i}>
          <Skeleton className="h-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default function MyVideos() {
  const {
    results: videos,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.videos.getCurrentUserVideosPaginated,
    {},
    { initialNumItems: 8 },
  );
  const channels = useQuery(api.channels.getUserChannels);

  return (
    <AuthLoader authLoading={<AuthLoadingSkeleton />}>
      <div className="container h-full py-12">
        <h1
          className={cn(
            "w-full text-center font-nosifer text-2xl font-bold text-purple-300 md:text-[40px]",
          )}
        >
          Your Videos
        </h1>
        <p
          className={cn(
            "w-full py-4 text-center font-special text-base md:text-lg",
          )}
        >
          Here are the videos you have generated.
        </p>
        {videos.length > 0 && (
          <div>
            <div className="float-right hidden max-w-full md:block">
              {channels?.length && channels?.length > 0 ? (
                <div>
                  Connected channels:{" "}
                  <div className="flex flex-col gap-2">
                    {channels.map((c) => (
                      <ChannelItem key={c._id} channel={c} />
                    ))}
                  </div>
                </div>
              ) : (
                <ConnectYoutubeButton variant={"link"}>
                  {({ isConnecting }) => (
                    <div>
                      {isConnecting ? (
                        "Getting connection link"
                      ) : (
                        <div className="flex items-center gap-2">
                          <PlusIcon className="h-4 w-4" /> Connect youtube
                        </div>
                      )}
                    </div>
                  )}
                </ConnectYoutubeButton>
              )}
            </div>
            <div className="grid w-full grid-cols-1 gap-4 py-12 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <VideoItem video={v} key={v._id} channels={channels} />
              ))}
            </div>
            {status === "CanLoadMore" && (
              <div className="flex justify-center pb-12">
                <Button
                  className="font-amatic text-[24px]"
                  onClick={() => loadMore(8)}
                >
                  Load More
                </Button>
              </div>
            )}
            {status === "LoadingMore" && (
              <div className="flex justify-center pb-12">
                <div className={cn("font-amatic text-2xl font-bold")}>
                  Loading more videos...
                </div>
              </div>
            )}
            {channels?.length && channels?.length > 0 && (
              <div className="mt-8 border-t border-purple-700 pt-4 md:hidden">
                <p className="font-special text-sm text-purple-300">
                  Connected channels:
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {channels.map((c) => (
                    <ChannelItem key={c._id} channel={c} />
                  ))}
                </div>
              </div>
            )}
            {(!channels?.length || channels.length === 0) && (
              <div className="mt-8 text-center md:hidden">
                <ConnectYoutubeButton variant={"link"}>
                  {({ isConnecting }) => (
                    <span className="font-special text-sm">
                      {isConnecting
                        ? "Getting connection link"
                        : "Connect youtube"}
                    </span>
                  )}
                </ConnectYoutubeButton>
              </div>
            )}
          </div>
        )}
        {videos.length === 0 && status !== "LoadingFirstPage" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <p
              className={cn(
                "text-center font-amatic text-2xl font-bold md:text-[40px]",
              )}
            >
              You don&apos;t have any videos.
            </p>
            <Button className="font-amatic text-[24px]" asChild>
              <Link href="/stories">Go to Stories</Link>
            </Button>
          </div>
        )}
        {status === "LoadingFirstPage" && (
          <div className="flex h-full w-full items-center justify-center">
            <div
              className={cn("font-amatic text-2xl font-bold md:text-[40px]")}
            >
              Loading videos...
            </div>
          </div>
        )}
      </div>
    </AuthLoader>
  );
}
