"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { Monitor, Smartphone, User, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthLoader } from "@/components/shared/auth-loader";
import { Loader2Icon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const mutate = useMutation(api.stories.createStory);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const [videoFormat, setVideoFormat] = useState<"16:9" | "9:16">("16:9");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("none");
  const { toast } = useToast();

  const teams = useQuery(api.teams.list);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const storyId = await mutate({
        createType: "by-segments",
        format: videoFormat,
        name: "Untitled",
        story: "",
        prompt: "",
        teamId:
          selectedTeamId !== "none"
            ? (selectedTeamId as Id<"teams">)
            : undefined,
      });
      router.push(`/stories/${storyId}`);
    } catch (error) {
      toast({
        title: "Failed to create story",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  };

  return (
    <AuthLoader
      authLoading={
        <div className="flex h-screen items-center justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center py-32">
        <h1
          className={cn(
            "mb-4 text-center font-kecal text-4xl font-[700] text-purple-300",
          )}
        >
          Create Your Video
        </h1>
        <p
          className={cn("mb-8 text-center font-kecal text-lg text-gray-300")}
        >
          Choose your video orientation and start creating.
        </p>
        <div className="mx-auto gap-8 font-kecal md:grid md:grid-cols-2">
          <Button
            onClick={() => {
              setVideoFormat("9:16");
            }}
            className={cn(
              videoFormat === "9:16"
                ? "border-2 border-white bg-primary"
                : "opacity-70",
              "flex h-52 w-80 flex-col items-center rounded-none bg-primary p-6 transition-colors hover:bg-primary-foreground",
            )}
          >
            <div className="mb-4 text-5xl">
              <Smartphone className="h-10 w-10" />{" "}
            </div>
            <p className="text-center font-semibold">Vertical</p>
          </Button>
          <Button
            onClick={() => {
              setVideoFormat("16:9");
            }}
            className={cn(
              videoFormat === "16:9"
                ? "border-2 border-white bg-primary"
                : "opacity-70",
              "flex h-52 w-80 flex-col items-center rounded-none bg-primary p-6 transition-colors hover:bg-primary-foreground",
            )}
          >
            <div className="mb-4 text-5xl">
              <Monitor className="h-10 w-10" />{" "}
            </div>
            <p className="text-center font-semibold">Horizontal</p>
          </Button>
          <div className="col-span-2 space-y-2">
            <Label className="text-purple-400">Team (Optional)</Label>
            <p className="text-sm text-gray-400">
              Select a team to share this story with, or leave empty for
              private.
            </p>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger className="border-purple-700 bg-gray-900 text-purple-300">
                <SelectValue placeholder="Select a team">
                  {selectedTeamId === "none"
                    ? "Private (No Team)"
                    : (teams?.find((t) => t._id === selectedTeamId)?.name ??
                      "Select a team")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-purple-700 bg-gray-900 text-purple-300">
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Private (No Team)
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
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className={cn(
              "col-span-2 w-full bg-white text-lg text-black hover:bg-gray-100",
            )}
          >
            {isCreating ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Start writing"
            )}
          </Button>
        </div>
      </div>
    </AuthLoader>
  );
};

export default Page;
