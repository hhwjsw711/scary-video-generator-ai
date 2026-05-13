"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import Image from "next/image";
import { Upload, X } from "lucide-react";

type AddTalentSheetDialogProps = {
  talentId: Id<"talents">;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
};

export function AddTalentSheetDialog({
  talentId,
  trigger,
  onSuccess,
}: AddTalentSheetDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const getStorageUrl = useMutation(api.storage.getStorageUrl);
  const addTalentSheet = useMutation(api.talent.addTalentSheet);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleClose = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setName("");
    setFile(null);
    setPreview(null);
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) return;

    setIsUploading(true);
    try {
      const uploadUrl: string = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Failed to upload to storage");
      }

      const { storageId } = (await result.json()) as { storageId: string };

      const imageUrl = await getStorageUrl({
        storageId: storageId as Id<"_storage">,
      });

      await addTalentSheet({
        talentId,
        name: name.trim(),
        imageUrl,
        isDefault: false,
        source: "manual_upload",
      });

      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create sheet:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => (isOpen ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Add Sheet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Talent Sheet</DialogTitle>
            <DialogDescription>
              Upload an image to create a new talent sheet.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sheetName">Sheet Name</Label>
              <Input
                id="sheetName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Casual, Formal, Action"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Sheet Image</Label>
              {preview ? (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-800">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-500/50 bg-gray-800/50 p-4 hover:border-purple-400 hover:bg-gray-800"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mb-2 h-8 w-8 text-purple-400/50" />
                  <p className="text-sm text-purple-300">Click to upload</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isUploading || !name.trim() || !file}
            >
              {isUploading ? "Creating..." : "Create Sheet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
