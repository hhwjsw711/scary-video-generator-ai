"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { Button } from "./button";
import { Progress } from "./progress";

interface FileUploadProps {
  value: File[];
  onValueChange: (files: File[]) => void;
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, percent: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    { value, onValueChange, onUpload, accept, multiple, disabled, className },
    ref,
  ) => {
    const [uploadProgress, setUploadProgress] = React.useState<
      Map<string, number>
    >(new Map());
    const [isUploading, setIsUploading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = React.useState<Map<string, string>>(
      new Map(),
    );

    React.useEffect(() => {
      const newUrls = new Map<string, string>();
      for (const file of value) {
        newUrls.set(file.name, URL.createObjectURL(file));
      }
      setPreviewUrls(newUrls);
      return () => {
        for (const url of newUrls.values()) {
          URL.revokeObjectURL(url);
        }
      };
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const newFiles = multiple ? [...value, ...files] : files;
        onValueChange(newFiles);

        if (onUpload && files.length > 0) {
          setIsUploading(true);
          void onUpload(files, {
            onProgress: (file, percent) => {
              setUploadProgress((prev) =>
                new Map(prev).set(file.name, percent),
              );
            },
            onSuccess: (file) => {
              setUploadProgress((prev) => {
                const next = new Map(prev);
                next.delete(file.name);
                return next;
              });
            },
            onError: (file, error) => {
              console.error("Upload error:", error);
              setUploadProgress((prev) => {
                const next = new Map(prev);
                next.delete(file.name);
                return next;
              });
            },
          }).finally(() => setIsUploading(false));
        }
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleRemove = (fileName: string) => {
      const filtered = value.filter((f) => f.name !== fileName);
      onValueChange(filtered);
    };

    return (
      <div ref={ref} className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        {value.length === 0 ? (
          <div
            className={cn(
              "flex min-h-[120px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-500/50 bg-gray-800/50 p-4 transition-colors",
              "hover:border-purple-400 hover:bg-gray-800",
              disabled && "pointer-events-none opacity-50",
            )}
            onClick={() => !disabled && inputRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-purple-400/50" />
            <p className="mt-2 text-sm font-medium text-purple-300">
              Drag & drop or paste
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 border-purple-500 text-purple-300 hover:bg-purple-700 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              disabled={disabled}
            >
              Browse files
            </Button>
            <p className="mt-1 text-xs text-purple-400">Images and videos</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {value.map((file) => (
              <div
                key={file.name}
                className="group relative aspect-square overflow-hidden rounded-lg border border-purple-500 bg-gray-800"
              >
                {previewUrls.has(file.name) ? (
                  file.type.startsWith("video/") ? (
                    <video
                      src={previewUrls.get(file.name)}
                      className="size-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={previewUrls.get(file.name)}
                      alt={file.name}
                      className="size-full object-cover"
                    />
                  )
                ) : null}
                {uploadProgress.has(file.name) && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <Progress
                      value={uploadProgress.get(file.name)}
                      className="h-1"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file.name);
                  }}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {multiple && (
              <div
                className={cn(
                  "relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-purple-500/50 bg-gray-800/50 transition-colors",
                  "hover:border-purple-400 hover:bg-gray-800",
                  disabled && "pointer-events-none opacity-50",
                )}
                onClick={() => !disabled && inputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-purple-400/50" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";

export { FileUpload };
export type { FileUploadProps };
