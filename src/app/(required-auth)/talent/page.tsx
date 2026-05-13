"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  EllipsisVertical,
  PlusIcon,
  Star,
  TrashIcon,
  User,
  Sparkles,
  ImageIcon,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import type { Doc } from "~/convex/_generated/dataModel";

export default function Page() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const router = useRouter();

  const talents = useQuery(api.talent.getTalents, {
    favoritesOnly: filter === "favorites",
  });
  const toggleFavorite = useMutation(api.talent.toggleTalentFavorite);
  const deleteTalent = useMutation(api.talent.deleteTalent);

  return (
    <div className="container h-full py-12">
      <h1
        className={cn(
          "mb-4 w-full text-center font-nosifer text-2xl font-bold text-purple-300 md:text-[40px]",
        )}
      >
        Talent Library
      </h1>

      {talents && talents.length > 0 ? (
        <>
          <p className={cn("py-4 text-center font-special text-lg")}>
            Manage your team&apos;s talent for consistent AI-generated content.
          </p>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                className="gap-2 border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-white"
                onClick={() => router.push("/talent?filter=all")}
              >
                <User className="h-4 w-4" />
                All Talent
              </Button>
              <Button
                variant={filter === "favorites" ? "default" : "outline"}
                size="sm"
                className="gap-2 border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-white"
                onClick={() => router.push("/talent?filter=favorites")}
              >
                <Star className="h-4 w-4" />
                Favorites
              </Button>
            </div>
            <AddTalentDialog />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {talents?.map((talent) => (
              <TalentCard
                key={talent._id}
                talent={talent}
                onToggleFavorite={() => toggleFavorite({ id: talent._id })}
                onDelete={() => deleteTalent({ id: talent._id })}
                onClick={() => router.push(`/talent/${talent._id}`)}
              />
            ))}
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border-2 border-purple-500 md:min-h-[300px]">
              <AddTalentDialog />
            </div>
          </div>
        </>
      ) : talents && talents.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
          <p className={cn("font-amatic text-[40px] font-bold")}>
            You don&apos;t have any talent yet.
          </p>
          <AddTalentDialog />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className={cn("font-amatic text-[40px] font-bold")}>
            Loading talents ...
          </div>
        </div>
      )}
    </div>
  );
}

function TalentCard({
  talent,
  onToggleFavorite,
  onDelete,
  onClick,
}: {
  talent: Doc<"talents"> & {
    sheets: Doc<"talentSheets">[];
    media: Doc<"talentMedia">[];
  };
  onToggleFavorite: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const sortedMedia = [...(talent.media || [])].sort(
    (a, b) => a._creationTime - b._creationTime,
  );
  const firstMedia = sortedMedia[0];
  const firstMediaUrl = firstMedia?.url;

  const defaultSheet = talent.sheets?.find((s) => s.isDefault);
  const sheetImageUrl = defaultSheet?.imageUrl;
  const talentImageUrl = talent.imageUrl;

  const imageUrl = firstMediaUrl || sheetImageUrl || talentImageUrl;

  const imageCount =
    talent.media?.filter((m) => m.type === "image").length || 0;
  const videoCount =
    talent.media?.filter((m) => m.type === "video").length || 0;
  const isFirstMediaVideo = firstMedia?.type === "video";
  const sheetCount = talent.sheets?.length || 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-purple-500 font-special hover:border-purple-300",
      )}
    >
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex flex-1 items-center gap-2">
          <h3 className="line-clamp-1 overflow-hidden text-sm font-medium tracking-tight text-purple-200">
            {talent.name}
          </h3>
          {talent.isHuman ? (
            <span className="inline-flex items-center rounded-full border bg-blue-700/50 px-2 py-1 text-xs font-semibold text-purple-200">
              Human
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border bg-purple-700/50 px-2 py-1 text-xs font-semibold text-purple-200">
              <Sparkles className="mr-1 h-3 w-3" />
              AI
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Star
              className={cn(
                "h-4 w-4",
                talent.isFavorite && "fill-yellow-400 text-yellow-400",
              )}
            />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisVertical className="h-4 w-4 text-purple-300" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-fit rounded-lg border border-purple-500 !p-0"
              align="end"
              sideOffset={4}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirm(`Delete "${talent.name}"? This cannot be undone.`)
                  ) {
                    onDelete();
                  }
                }}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm text-rose-500 dark:bg-gray-900 dark:hover:bg-black"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between bg-gray-900">
        <div>
          <div className="relative aspect-square w-full bg-gray-800">
            {imageUrl ? (
              <>
                {isFirstMediaVideo ? (
                  <>
                    <video
                      src={imageUrl}
                      className="h-full w-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Video className="h-10 w-10 text-white/80" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={imageUrl}
                    className="object-cover"
                    fill
                    alt={talent.name}
                  />
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-12 w-12 text-gray-600" />
              </div>
            )}
          </div>
          <div className="p-4">
            {talent.description && (
              <div className="line-clamp-2 overflow-hidden text-xs text-gray-400">
                {talent.description}
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              {sheetCount > 0 && (
                <span className="flex items-center gap-1 text-purple-300">
                  <ImageIcon className="h-3 w-3" />
                  {sheetCount} {sheetCount === 1 ? "sheet" : "sheets"}
                </span>
              )}
              {imageCount > 0 && (
                <span className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {imageCount} {imageCount === 1 ? "image" : "images"}
                </span>
              )}
              {videoCount > 0 && (
                <span className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  {videoCount} {videoCount === 1 ? "video" : "videos"}
                </span>
              )}
              {sheetCount === 0 && imageCount === 0 && videoCount === 0 && (
                <span className="text-gray-600">No reference</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddTalentDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isHuman, setIsHuman] = useState(true);
  const createTalent = useMutation(api.talent.createTalent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createTalent({
        name: name.trim(),
        description: description.trim() || undefined,
        isHuman,
      });
      setName("");
      setDescription("");
      setIsHuman(true);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-white"
        >
          <PlusIcon className="h-4 w-4" />
          Add Talent
        </Button>
      </DialogTrigger>
      <DialogContent className="border-purple-500 bg-gray-900 text-purple-300 sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-amatic text-2xl">
              Add New Talent
            </DialogTitle>
            <DialogDescription className="text-purple-400">
              Add a talent to your library for consistent AI-generated content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-purple-300">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter talent name"
                className="border-purple-500 bg-gray-800 text-purple-200"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-purple-300">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="border-purple-500 bg-gray-800 text-purple-200"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isHuman" className="text-purple-300">
                Is Human
              </Label>
              <Switch
                id="isHuman"
                checked={isHuman}
                onCheckedChange={setIsHuman}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="bg-purple-500 text-white hover:bg-purple-700"
            >
              {isLoading ? "Adding..." : "Add Talent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
