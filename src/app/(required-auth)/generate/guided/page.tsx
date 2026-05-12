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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/convex/_generated/api";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(50, "Description at least 50 characters.")
    .max(10000, "Desciption limit is 10000 characters"),
});

const GuidedStoryCreation = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
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
      });
      router.push(`/stories/${storyId}/refine`);
    } catch (error) {
      console.log((error as ConvexError<string>).data);
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
            {/** @ts-ignore */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Generate guided Story (1 credit)</span>
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
