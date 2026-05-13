"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TalentMediaUpload } from "./talent-media-upload";
import type { Id } from "~/convex/_generated/dataModel";
import { Plus } from "lucide-react";

type AddTalentMediaDialogProps = {
  talentId: Id<"talents">;
  trigger?: React.ReactNode;
  onComplete?: () => void;
};

export function AddTalentMediaDialog({
  talentId,
  trigger,
  onComplete,
}: AddTalentMediaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    if (isUploading) return;
    setOpen(false);
    router.refresh();
    onComplete?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => (isOpen ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Media
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl"
        onInteractOutside={(e) => {
          if (isUploading) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Reference Media</DialogTitle>
          <DialogDescription>
            Upload images or videos to use as reference for this talent.
          </DialogDescription>
        </DialogHeader>

        <TalentMediaUpload
          talentId={talentId}
          onComplete={handleClose}
          onUploadingChange={setIsUploading}
        />
      </DialogContent>
    </Dialog>
  );
}
