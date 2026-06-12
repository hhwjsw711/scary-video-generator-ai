"use client";
import { AuthLoader } from "@/components/shared/auth-loader";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import {
  Loader2Icon,
  Sparkles,
  Ghost,
  Skull,
  Eye,
  Film,
  Castle,
  Briefcase,
  Award,
  Rocket,
  Palette,
  Monitor,
  Mountain,
  Camera,
  UsersIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DURATION_PRESETS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "1m" },
  { value: 120, label: "2m" },
  { value: 180, label: "3m" },
] as const;

const STYLE_PRESETS = [
  {
    id: "product-ad",
    label: "Product Ad",
    icon: Sparkles,
    description: "Fresh, tactile product content",
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: Castle,
    description: "Luxury property cinematography",
  },
  {
    id: "animatic",
    label: "Animatic",
    icon: Film,
    description: "Storyboard pre-visualization",
  },
  {
    id: "corporate",
    label: "Corporate",
    icon: Briefcase,
    description: "Clean professional visuals",
  },
  {
    id: "award-season",
    label: "Award Season",
    icon: Award,
    description: "Deep emotional storytelling",
  },
  {
    id: "documentary",
    label: "Documentary",
    icon: Camera,
    description: "Natural observational style",
  },
  {
    id: "action",
    label: "Action",
    icon: Rocket,
    description: "High-energy dynamic visuals",
  },
  {
    id: "rom-com",
    label: "Rom-Com",
    icon: Eye,
    description: "Warm bright cheerful style",
  },
  {
    id: "animated",
    label: "Animated",
    icon: Palette,
    description: "Premium stylized animation",
  },
  {
    id: "neo-noir",
    label: "Neo-Noir",
    icon: Ghost,
    description: "Dark stylized thriller",
  },
  {
    id: "pastel",
    label: "Pastel",
    icon: Sparkles,
    description: "Whimsical symmetrical pastels",
  },
  {
    id: "sci-fi",
    label: "Sci-Fi Futuristic",
    icon: Monitor,
    description: "High-tech sleek designs",
  },
  {
    id: "horror-gothic",
    label: "Horror Gothic",
    icon: Skull,
    description: "Dark atmospheric horror",
  },
  {
    id: "western",
    label: "Western Epic",
    icon: Mountain,
    description: "Wide vistas golden hour",
  },
  {
    id: "lo-fi-retro",
    label: "Lo-Fi Retro",
    icon: Camera,
    description: "Vintage smartphone aesthetic",
  },
] as const;

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(50, "Description at least 50 characters.")
    .max(10000, "Desciption limit is 10000 characters"),
});

const GuidedStoryCreation = () => {
  const router = useRouter();
  const [targetDuration, setTargetDuration] = useState(30);
  const [selectedStyleId, setSelectedStyleId] =
    useState<string>("horror-gothic");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("none");

  const teams = useQuery(api.teams.list);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      targetDuration: 30,
    },
  });
  const mutateCreate = useMutation(api.stories.createStory);
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const storyId = await mutateCreate({
        createType: "by-ai",
        name: data.title,
        prompt: data.description,
        story: "",
        targetDuration: targetDuration,
        styleId: selectedStyleId,
        teamId:
          selectedTeamId !== "none"
            ? (selectedTeamId as Id<"teams">)
            : undefined,
      });
      router.push(`/stories/${storyId}/refine`);
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
          Guided Video Creation
        </h1>
        <p
          className={cn("mb-8 text-center font-special text-lg text-gray-300")}
        >
          Let AI guide you through creating your video step by step.
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
                name="title"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-400">
                      Story Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[250px] bg-gray-900 font-sans md:min-h-[400px]"
                        placeholder="Describe your story idea, including themes, characters, and key plot points..."
                        required
                      />
                    </FormControl>
                    <span className="block text-xs">
                      {10000 - form.watch("description").length} characters
                      remaining
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-purple-400">Target Video Duration</Label>
                <p className="text-sm text-gray-400">
                  Choose the target length for your video. This determines how
                  detailed the AI-generated story will be.
                </p>
                <div className="flex flex-wrap gap-2">
                  {DURATION_PRESETS.map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      onClick={() => setTargetDuration(preset.value)}
                      className={cn(
                        "min-w-[80px] flex-1 transition-all",
                        targetDuration === preset.value
                          ? "bg-primary text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600",
                      )}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-purple-400">
                  {targetDuration < 60
                    ? `${targetDuration} seconds (${Math.round((targetDuration / 30) * 4)}-${Math.round((targetDuration / 30) * 6)} scenes)`
                    : targetDuration < 120
                      ? `1 minute (${Math.round((targetDuration / 60) * 8)}-${Math.round((targetDuration / 60) * 12)} scenes)`
                      : targetDuration < 180
                        ? `2 minutes (${Math.round((targetDuration / 60) * 15)}-${Math.round((targetDuration / 60) * 20)} scenes)`
                        : `3 minutes (${Math.round((targetDuration / 60) * 20)}-${Math.round((targetDuration / 60) * 30)} scenes)`}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-400">Visual Style</Label>
                <p className="text-sm text-gray-400">
                  Choose the visual style for your horror video. Each style
                  includes unique mood, lighting, and camera direction.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {STYLE_PRESETS.map((style) => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyleId(style.id)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-lg border-2 p-3 transition-all hover:border-purple-400",
                          selectedStyleId === style.id
                            ? "border-primary bg-primary/20"
                            : "border-gray-700 bg-gray-800 hover:bg-gray-700",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              selectedStyleId === style.id
                                ? "text-purple-300"
                                : "text-gray-400",
                            )}
                          />
                          <span
                            className={cn(
                              "font-special text-sm font-medium",
                              selectedStyleId === style.id
                                ? "text-purple-300"
                                : "text-gray-300",
                            )}
                          >
                            {style.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {style.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Generate Script (1 credit)</span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AuthLoader>
  );
};

function UnauthenticatedSkeleton() {
  return (
    <div className="">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="mt-8 h-[400px] w-full" />
    </div>
  );
}

export default GuidedStoryCreation;
