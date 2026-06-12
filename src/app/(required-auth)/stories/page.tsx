"use client";
import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import {
  EllipsisVertical,
  Lock,
  Monitor,
  Phone,
  PhoneIcon,
  PlusIcon,
  Smartphone,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, memo } from "react";
import { api } from "~/convex/_generated/api";
import type { Doc, Id } from "~/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page({
  params: { storyId },
}: {
  params: { storyId: Id<"stories"> };
}) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");

  const {
    results: stories,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.stories.getStoriesPaginated,
    {},
    { initialNumItems: 9 },
  );
  const teams = useQuery(api.teams.list);

  const displayedStories = useMemo(() => {
    if (selectedTeamId === "all") {
      return stories ?? [];
    } else if (selectedTeamId === "private") {
      return (stories ?? []).filter((s) => !s.teamId);
    } else {
      return (stories ?? []).filter((s) => s.teamId === selectedTeamId);
    }
  }, [selectedTeamId, stories]);

  return (
    <div className="container h-full py-12">
      <h1
        className={cn(
          "mb-4 w-full text-center font-nosifer text-2xl font-bold text-purple-300 md:text-[40px]",
        )}
      >
        Your Stories
      </h1>

      <p className={cn("py-4 text-center font-special text-lg")}>
        Here are the stories you&apos;ve generated.
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
          <SelectTrigger className="w-[180px] border-purple-500 bg-gray-900 text-purple-300 hover:border-purple-300">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent className="border-purple-500 bg-gray-900 text-purple-300">
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                All Stories
              </div>
            </SelectItem>
            <SelectItem value="private">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Private Only
              </div>
            </SelectItem>
            {teams?.map((team) => (
              <SelectItem key={team._id} value={team._id}>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {displayedStories.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
          <p className={cn("font-amatic text-[40px] font-bold")}>
            {selectedTeamId === "all"
              ? "You don't have any story yet."
              : selectedTeamId === "private"
                ? "No private stories found."
                : "No stories in this team."}
          </p>
          {(selectedTeamId === "all" || selectedTeamId === "private") && (
            <Button className={cn("font-amatic text-[24px]")} asChild>
              <Link href="/generate" className="!font-bold">
                Generate
              </Link>
            </Button>
          )}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {displayedStories.map((s) => (
          <StoryItem key={s._id} story={s} />
        ))}
        {displayedStories.length > 0 && (
          <Link
            href="/generate"
            className={cn(
              "flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-purple-500 text-purple-500 hover:border-purple-300 md:min-h-[400px]",
            )}
          >
            <div>
              <PlusIcon className="h-10 w-10" />
            </div>
            <div>Create New Story</div>
          </Link>
        )}
      </div>
      {status === "CanLoadMore" && (
        <div className="mt-6 flex justify-center">
          <Button
            className="font-amatic text-[24px]"
            onClick={() => loadMore(9)}
          >
            Load More
          </Button>
        </div>
      )}
      {status === "LoadingMore" && (
        <div className="flex h-full items-center justify-center">
          <div className={cn("font-amatic text-[40px] font-bold")}>
            Loading more stories ...
          </div>
        </div>
      )}
      {status === "LoadingFirstPage" && (
        <div className="flex h-full items-center justify-center">
          <div className={cn("font-amatic text-[40px] font-bold")}>
            Loading stories ...
          </div>
        </div>
      )}
    </div>
  );
}
const StoryItem = memo(function StoryItem({
  story,
}: {
  story: Doc<"stories">;
}) {
  const router = useRouter();
  const mutateDelete = useMutation(api.stories.deleteStory);
  const firstImage = useQuery(api.storySegments.getFirstSegmentImage, {
    storyId: story._id,
  });
  const isDoneRefine = useMemo(
    () =>
      story?.AIGenerateInfo ? story?.AIGenerateInfo?.finishedRefine : true,
    [story?.AIGenerateInfo?.finishedRefine],
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await mutateDelete({ id: story._id });
    } catch {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  return (
    <div
      key={story._id}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border-2 border-purple-500 font-special hover:border-purple-300",
      )}
    >
      <div className="flex justify-between bg-gray-800 px-4 py-2">
        <div className="mr-2 flex flex-1 items-center space-x-2">
          {story.teamId && (
            <div className="inline-flex items-center rounded-full border border-purple-500 bg-purple-900/50 px-2 py-1 text-xs font-semibold text-purple-300">
              <UsersIcon className="mr-1 h-3 w-3" />
              Team
            </div>
          )}
          <h3 className="line-clamp-1 overflow-hidden text-sm font-medium tracking-tight text-purple-200">
            {story.name}
          </h3>
          {story.format === "16:9" ? (
            <div className="inline-flex items-center rounded-full border bg-blue-700/50 px-2 py-1 text-xs font-semibold text-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Monitor className="mr-2 h-4 w-4" />
              Horizontal
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full border bg-purple-700/50 px-2 py-1 text-xs font-semibold text-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Smartphone className="mr-2 h-4 w-4" />
              Vertical
            </div>
          )}
        </div>

        <Popover>
          <PopoverTrigger>
            <EllipsisVertical />
          </PopoverTrigger>
          <PopoverContent
            className="w-fit rounded-lg border border-purple-500 !p-0"
            align="end"
          >
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg border-b border-purple-500 px-4 py-2 text-sm text-rose-500 dark:bg-gray-900 dark:hover:bg-black"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          </PopoverContent>
        </Popover>
      </div>
      {isDoneRefine ? (
        <div className="flex flex-1 flex-col justify-between bg-gray-900">
          <div>
            <div className="relative aspect-video w-full">
              {firstImage && (
                <Image
                  src={firstImage}
                  className="object-contain"
                  fill
                  alt={story.name}
                />
              )}
            </div>
            <div className="p-4">
              <div className="line-clamp-4 overflow-hidden font-sans text-sm">
                {story.content}
              </div>
            </div>
          </div>
          <div className="p-4">
            <Button className="bg-purple-500" asChild>
              <Link href={`/stories/${story._id}`}>View Story</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-1 items-center justify-center">
          <Link
            href={`/stories/${story._id}/refine`}
            className="m-auto block w-fit bg-gray-500 px-4 py-2 text-white"
          >
            Finish refining
          </Link>
        </div>
      )}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Story"
        description={`Are you sure you want to delete "${story.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
});
