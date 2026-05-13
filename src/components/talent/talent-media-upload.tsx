"use client";

import { useState, useCallback } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import type { FileUploadProps } from "@/components/ui/file-upload";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

interface TalentMediaUploadProps {
  talentId: Id<"talents">;
  disabled?: boolean;
}

export function TalentMediaUpload({
  talentId,
  disabled = false,
}: TalentMediaUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadTalentMedia = useMutation(api.storage.uploadTalentMedia);

  const handleUpload: FileUploadProps["onUpload"] = useCallback(
    async (
      uploadFiles: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, percent: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      setIsUploading(true);

      for (const uploadFile of uploadFiles) {
        try {
          // 1. 获取上传 URL
          const uploadUrl: string = await generateUploadUrl();

          // 2. 直接上传到 Convex 存储
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": uploadFile.type },
            body: uploadFile,
          });

          if (!result.ok) {
            throw new Error("Failed to upload to storage");
          }

          const { storageId } = (await result.json()) as { storageId: string };

          // 3. 标记上传完成
          const mediaType = uploadFile.type.startsWith("video/")
            ? ("video" as const)
            : ("image" as const);

          await uploadTalentMedia({
            talentId,
            type: mediaType,
            storageId: storageId as Id<"_storage">,
          });

          onProgress(uploadFile, 100);
          onSuccess(uploadFile);
        } catch (error) {
          console.error("Upload error:", error);
          onError(
            uploadFile,
            error instanceof Error ? error : new Error("Upload failed"),
          );
        }
      }

      setIsUploading(false);
      setFiles([]);
    },
    [talentId, generateUploadUrl, uploadTalentMedia],
  );

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onUpload={handleUpload}
      accept="image/*,video/*"
      multiple
      disabled={disabled || isUploading}
    />
  );
}
