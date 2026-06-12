"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-purple-700 bg-gray-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-nosifer text-2xl text-purple-300">
            {title}
          </DialogTitle>
          <DialogDescription className="font-special text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="font-special text-purple-300 hover:bg-gray-800 hover:text-white"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "font-special",
              variant === "destructive" && "bg-red-600 hover:bg-red-700",
            )}
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
