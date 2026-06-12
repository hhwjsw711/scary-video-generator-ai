"use client";
import { AuthLoader } from "@/components/shared/auth-loader";
import { Button } from "@/components/ui/button"; // Import Shadcn UI components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn, splitStory } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import {
  Loader2Icon,
  Monitor,
  SmartphoneIcon,
  User,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
const schema = z.object({
  name: z.string().min(1),
  story: z.string().min(1, "The story should be at least 200 characters long."),
});

const Page = () => {
  const [videoFormat, setVideoFormat] = useState<"16:9" | "9:16">("16:9");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("none");

  const router = useRouter();
  const mutate = useMutation(api.stories.createStory);
  const teams = useQuery(api.teams.list);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      story: "",
    },
  });
  const { toast } = useToast();
  const segmentCount = splitStory(form.watch("story")).length;
  const textTokens = Math.ceil(form.watch("story").length / 1000);
  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const id = await mutate({
        ...data,
        createType: "full-scripted",
        format: videoFormat,
        teamId:
          selectedTeamId !== "none"
            ? (selectedTeamId as Id<"teams">)
            : undefined,
      });
      router.push("/stories/" + id);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as ConvexError<string>).data,
        variant: "destructive",
      });
      toast({
        title: "Uh oh!",
        description: (error as ConvexError<string>).data,
        variant: "destructive",
      });
    }
  };
  return (
    <AuthLoader authLoading={<UnauthenticatedSkeleton />}>
      <div className="container flex min-h-screen flex-col items-center justify-center py-12">
        <h1
          className={cn(
            "mb-4 text-center font-nosifer text-4xl font-[700] text-purple-300",
          )}
        >
          Create from Script
        </h1>
        <p
          className={cn("mb-8 text-center font-special text-lg text-gray-300")}
        >
          Paste your script or describe your idea — AI generates scenes,
          visuals, and music.
        </p>

        <div
          className={cn(
            "w-full max-w-[800px] rounded-lg border-2 border-purple-500 bg-gray-100 p-4 font-special dark:bg-gray-800 md:p-8",
          )}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => onSubmit(values))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-400">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        className="bg-gray-900"
                        placeholder="Enter your story title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-purple-400">Team (Optional)</Label>
                <p className="text-sm text-gray-400">
                  Select a team to share this story with, or leave empty for
                  private.
                </p>
                <Select
                  value={selectedTeamId}
                  onValueChange={setSelectedTeamId}
                >
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

              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-400">
                      Your Script
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[250px] bg-gray-900 font-sans md:min-h-[400px]"
                        {...field}
                        placeholder="Write your script here."
                      ></Textarea>
                    </FormControl>
                    <span className="block text-xs">
                      {10000 - form.watch("story").length} characters remaining
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-purple-400">Video Format</Label>
                <p className="text-sm text-gray-400">
                  Choose between vertical (TikTok/YouTube Shorts) or horizontal
                  (standard 1080p) format.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setVideoFormat("9:16")}
                    className={cn(
                      "flex w-full items-center justify-center gap-2",
                      videoFormat === "9:16" ? "bg-primary" : "!bg-gray-600",
                    )}
                  >
                    <SmartphoneIcon className="h-4 w-4" /> Vertical
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setVideoFormat("16:9")}
                    className={cn(
                      "flex w-full items-center justify-center gap-2",
                      videoFormat === "16:9" ? "bg-primary" : "!bg-gray-600",
                    )}
                  >
                    <Monitor className="h-4 w-4" /> Horizontal
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-purple-400">
                  Estimated Credit Usage:
                </Label>
                <table className="w-full">
                  <tbody>
                    <tr className="w-full border-b border-gray-700 transition-all duration-500 hover:bg-gray-900">
                      <td className="px-2 py-2 text-purple-400">Item</td>
                      <td className="px-2 py-2 text-right text-purple-400">
                        Credits
                      </td>
                    </tr>
                    <tr className="w-full border-b border-gray-700 transition-all duration-500 hover:bg-gray-900">
                      <td className="px-2 py-2">Image Generation</td>
                      <td className="px-2 py-2 text-right">
                        {segmentCount * 10}
                      </td>
                    </tr>
                    <tr className="w-full border-b border-gray-700 transition-all duration-500 hover:bg-gray-900">
                      <td className="px-2 py-2">Text Tokens</td>
                      <td className="px-2 py-2 text-right"> {textTokens}</td>
                    </tr>
                    <tr className="w-full border-b border-gray-700 transition-all duration-500 hover:bg-gray-900">
                      <td className="px-2 py-2">Total</td>
                      <td className="px-2 py-2 text-right">
                        {segmentCount * 10 + textTokens}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button
                className="w-full"
                type="submit"
                disabled={
                  form.formState.isSubmitting || form.formState.isLoading
                }
              >
                {form.formState.isSubmitting || form.formState.isLoading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <span>
                    Generate images and review ({segmentCount * 10 + textTokens}{" "}
                    credits)
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AuthLoader>
  );
};

export default Page;
function UnauthenticatedSkeleton() {
  return (
    <div className="">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="mt-8 h-[400px] w-full" />
    </div>
  );
}
