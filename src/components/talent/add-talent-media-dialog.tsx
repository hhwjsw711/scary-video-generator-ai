"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleClose = () => {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Reference Media</DialogTitle>
          <DialogDescription>
            Upload images or videos to use as reference for this talent.
          </DialogDescription>
        </DialogHeader>

        <TalentMediaUpload talentId={talentId} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
