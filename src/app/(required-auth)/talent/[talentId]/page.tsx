"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Pencil,
  Star,
  Sparkles,
  ImageIcon,
  Upload,
  User,
  Plus,
  X,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import type { Doc, Id } from "~/convex/_generated/dataModel";
import { AddTalentMediaDialog } from "@/components/talent/add-talent-media-dialog";
import { AddTalentSheetDialog } from "@/components/talent/add-talent-sheet-dialog";

export default function Page({
  params,
}: {
  params: { talentId: Id<"talents"> };
}) {
  const talent = useQuery(api.talent.getTalentById, { id: params.talentId });
  const toggleFavorite = useMutation(api.talent.toggleTalentFavorite);
  const deleteMedia = useMutation(api.talent.deleteTalentMedia);
  const deleteSheet = useMutation(api.talent.deleteTalentSheet);
  const setDefaultSheet = useMutation(api.talent.setDefaultSheet);

  if (talent === null) {
    return (
      <div className="container h-full py-12">
        <Card className="border-purple-500 bg-gray-900 p-8 text-center">
          <p className="mb-4 text-purple-300">Talent not found</p>
          <Button variant="outline" asChild>
            <Link href="/talent">Back to Talent</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (talent === undefined) {
    return (
      <div className="container h-full py-12">
        <div className="mb-6">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton
              key={`skeleton-${n}`}
              className="aspect-square rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container h-full py-12">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-4 text-purple-300 hover:bg-purple-700 hover:text-white"
        asChild
      >
        <Link href="/talent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Talent
        </Link>
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className={cn(
              "font-kecal text-2xl font-bold text-purple-300 md:text-[40px]",
            )}
          >
            {talent.name}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            {talent.isHuman ? (
              <span className="rounded bg-blue-700/50 px-2 py-1 text-xs font-medium text-purple-200">
                Human
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded bg-purple-700/50 px-2 py-1 text-xs font-medium text-purple-200">
                <Sparkles className="h-3 w-3" />
                AI
              </span>
            )}
            {talent.isFavorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          {talent.description && (
            <p className="mt-2 font-kecal text-purple-400">
              {talent.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <EditTalentDialog talent={talent} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavorite({ id: talent._id })}
            className="border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-white"
          >
            <Star
              className={cn(
                "h-4 w-4",
                talent.isFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-purple-300",
              )}
            />
          </Button>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-kecal text-lg text-xl font-semibold text-purple-200">
            Reference Media ({talent.media?.length || 0})
          </h2>
          <AddTalentMediaDialog
            talentId={talent._id}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Media
              </Button>
            }
          />
        </div>
        {talent.media && talent.media.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {talent.media.map((media) => (
              <Card
                key={media._id}
                className="group relative overflow-hidden border-purple-500 bg-gray-900"
              >
                <div className="relative aspect-square bg-gray-800">
                  {media.type === "image" && (
                    <Image
                      src={media.url}
                      alt="Reference"
                      className="h-full w-full object-cover"
                      fill
                    />
                  )}
                  {media.type === "video" && <VideoThumbnail url={media.url} />}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      if (confirm("Delete this media?")) {
                        void deleteMedia({ id: media._id });
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-purple-500 bg-gray-900 p-8 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-purple-500/30" />
            <p className="text-purple-400">
              No reference media yet. Upload images or videos to use as
              reference.
            </p>
          </Card>
        )}
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-kecal text-lg text-xl font-semibold text-purple-200">
            <ImageIcon className="h-5 w-5" />
            Talent Sheets ({talent.sheets?.length || 0})
          </h2>
          <AddTalentSheetDialog
            talentId={talent._id}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Sheet
              </Button>
            }
          />
        </div>

        {talent.sheets && talent.sheets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {talent.sheets.map((sheet) => (
              <Card
                key={sheet._id}
                className={cn(
                  "overflow-hidden border-purple-500 bg-gray-900",
                  sheet.isDefault && "ring-2 ring-primary",
                )}
              >
                <div className="group relative aspect-video bg-gray-800">
                  {sheet.imageUrl ? (
                    <Image
                      src={sheet.imageUrl}
                      alt={sheet.name}
                      className="h-full w-full object-cover"
                      fill
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-12 w-12 text-purple-500/30" />
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      if (confirm("Delete this sheet?")) {
                        void deleteSheet({ id: sheet._id });
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="absolute left-2 top-2 rounded bg-gray-900/80 px-2 py-1 text-xs text-purple-300 backdrop-blur-sm">
                    {sheet.source === "ai_generated" && (
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI
                      </span>
                    )}
                    {sheet.source === "manual_upload" && (
                      <span className="flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        Upload
                      </span>
                    )}
                  </div>

                  {sheet.isDefault && (
                    <div className="absolute right-2 top-2 rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                      Default
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 p-3">
                  <p className="line-clamp-1 text-sm font-medium text-purple-200">
                    {sheet.name}
                  </p>
                  {talent.sheets.length > 1 && !sheet.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDefaultSheet({
                          sheetId: sheet._id,
                          talentId: talent._id,
                        })
                      }
                      className="text-purple-300 hover:bg-purple-700 hover:text-white"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-purple-500 bg-gray-900 p-8 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-purple-500/30" />
            <p className="text-purple-400">
              No talent sheets yet. Add a sheet to represent this talent.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}

function VideoThumbnail({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-800">
        <Video className="h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={url}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        onMouseEnter={() => videoRef.current?.play()}
        onMouseLeave={() => videoRef.current?.pause()}
        onError={() => setHasError(true)}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 transition-opacity group-hover:opacity-0">
        <Video className="h-8 w-8 text-white/80" />
      </div>
    </>
  );
}

function EditTalentDialog({
  talent,
}: {
  talent: Doc<"talents"> & {
    sheets: Doc<"talentSheets">[];
    media: Doc<"talentMedia">[];
  };
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(talent.name);
  const [description, setDescription] = useState(talent.description || "");
  const [isHuman, setIsHuman] = useState(talent.isHuman ?? true);
  const updateTalent = useMutation(api.talent.updateTalent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await updateTalent({
        id: talent._id,
        name: name.trim(),
        description: description.trim() || undefined,
        isHuman,
      });
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
          size="icon"
          className="border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-purple-500 bg-gray-900 text-purple-300 sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-kecal text-2xl">
              Edit Talent
            </DialogTitle>
            <DialogDescription className="text-purple-400">
              Update talent information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-purple-300">
                Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-purple-500 bg-gray-800 text-purple-200"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-purple-300">
                Description
              </Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-purple-500 bg-gray-800 text-purple-200"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-isHuman" className="text-purple-300">
                Is Human
              </Label>
              <Switch
                id="edit-isHuman"
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
