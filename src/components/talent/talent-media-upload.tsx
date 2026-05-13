"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import type { FileUploadProps } from "@/components/ui/file-upload";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

interface TalentMediaUploadProps {
  talentId: Id<"talents">;
  disabled?: boolean;
  onComplete?: () => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function TalentMediaUpload({
  talentId,
  disabled = false,
  onComplete,
  onUploadingChange,
}: TalentMediaUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadTalentMedia = useMutation(api.storage.uploadTalentMedia);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setCompletedCount(0);
    onUploadingChange?.(true);

    for (const uploadFile of files) {
      try {
        const uploadUrl: string = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": uploadFile.type },
          body: uploadFile,
        });

        if (!result.ok) {
          throw new Error("Failed to upload to storage");
        }

        const { storageId } = (await result.json()) as { storageId: string };

        const mediaType = uploadFile.type.startsWith("video/")
          ? ("video" as const)
          : ("image" as const);

        await uploadTalentMedia({
          talentId,
          type: mediaType,
          storageId: storageId as Id<"_storage">,
        });

        setCompletedCount((prev) => prev + 1);
      } catch (error) {
        console.error("Upload error:", error);
        alert(
          `Failed to upload ${uploadFile.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }

    setIsUploading(false);
    onUploadingChange?.(false);
    setFiles([]);
    onComplete?.();
  }, [
    files,
    talentId,
    generateUploadUrl,
    uploadTalentMedia,
    onComplete,
    onUploadingChange,
  ]);

  return (
    <div className="space-y-4">
      <FileUpload
        value={files}
        onValueChange={setFiles}
        accept="image/*,video/*"
        multiple
        disabled={disabled || isUploading}
      />
      {files.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="bg-purple-500 text-white hover:bg-purple-700"
          >
            {isUploading
              ? `Uploading ${completedCount}/${files.length}...`
              : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </div>
  );
}
