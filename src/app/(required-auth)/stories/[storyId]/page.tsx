"use client";
import { useModal } from "@/components/providers/modal-provider";
import CustomModal from "@/components/shared/custom-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditStoryContextForm } from "@/components/stories/edit-story-context-form";
import { SegmentItem } from "@/components/stories/segment-item";
import { StoryMenus } from "@/components/stories/story-menus";
import { StoryTitle } from "@/components/stories/story-title";
import { UsersIcon, Lock } from "lucide-react";
import Link from "next/link";

export default function Page({
  params: { storyId },
}: {
  params: { storyId: Id<"stories"> };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const segments = useQuery(api.storySegments.getByStoryId, { storyId });
  const story = useQuery(api.stories.get, { id: storyId });
  const teams = useQuery(api.teams.list);
  const editStory = useMutation(api.stories.edit);
  const format = story?.format;
  const { setOpen } = useModal();
  const [isChangingTeam, setIsChangingTeam] = useState(false);

  useEffect(() => {
    if (story === null) {
      router.push("/stories");
    }
  }, [story, router]);

  const doneRefine = useMemo(
    () =>
      story?.AIGenerateInfo ? story?.AIGenerateInfo?.finishedRefine : true,
    [story?.AIGenerateInfo?.finishedRefine],
  );

  if (story === undefined) {
    return (
      <div className="container flex h-full items-center justify-center py-12">
        <div
          className={cn("font-kecal text-[40px] font-bold text-purple-300")}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (story === null) return notFound();

  return (
    <div className="container h-full py-12">
      {story && segments?.length !== undefined && (
        <>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <StoryTitle
              defaultName={story?.name}
              storyId={story?._id}
              format={format ?? "16:9"}
            />
            <div className="flex flex-wrap items-center gap-3">
              {teams && teams.length > 0 && (
                <Select
                  value={story.teamId || "private"}
                  onValueChange={async (value) => {
                    setIsChangingTeam(true);
                    try {
                      await editStory({
                        id: story._id,
                        teamId:
                          value === "private" ? null : (value as Id<"teams">),
                      });
                      toast({
                        title: "Team updated",
                        description:
                          value === "private"
                            ? "Story is now private"
                            : `Story moved to team`,
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update team",
                        variant: "destructive",
                      });
                    } finally {
                      setIsChangingTeam(false);
                    }
                  }}
                  disabled={isChangingTeam}
                >
                  <SelectTrigger className="w-[160px] border-purple-500 bg-gray-900 text-purple-300 hover:border-purple-300">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent className="border-purple-500 bg-gray-900 text-purple-300">
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Private
                      </div>
                    </SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4" />
                          {team.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                className={"font-kecal"}
                onClick={() =>
                  setOpen(
                    <CustomModal
                      title="Edit story context"
                      subheading="Modify the overall context of your story"
                    >
                      <EditStoryContextForm
                        context={
                          story.context
                            ? (story.context as { data?: string }).data
                            : ""
                        }
                        storyId={story._id}
                      />
                    </CustomModal>,
                  )
                }
              >
                Edit story context
              </Button>
            </div>
          </div>

          <div className="justify-between gap-8 md:grid md:grid-cols-2">
            {segments?.map((s, i) => (
              <SegmentItem
                segment={s}
                index={i + 1}
                key={s._id}
                canDelete={segments.length !== 1}
              />
            ))}

            {!doneRefine ? (
              <Link
                href={`/stories/${story._id}/refine`}
                className="block text-center md:col-span-2"
              >
                <div className="flex h-full items-center justify-center">
                  <div className={cn("font-kecal text-[40px] font-bold")}>
                    Continue Refine
                  </div>
                </div>
              </Link>
            ) : (
              segments?.length >= 1 && (
                <div className="col-span-2">
                  <StoryMenus
                    storyId={storyId}
                    name={story.name}
                    segments={segments}
                  />
                </div>
              )
            )}
          </div>
        </>
      )}

      {segments === undefined ||
        (segments.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className={cn("font-kecal text-[40px] font-bold")}>
              Loading segments ...
            </div>
          </div>
        ))}
    </div>
  );
}
