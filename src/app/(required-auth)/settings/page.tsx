"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { Camera, Loader2, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

export default function SettingsPage() {
  const user = useQuery(api.users.viewer);
  const updateUser = useMutation(api.users.update);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const getStorageUrl = useMutation(api.storage.getStorageUrl);

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevPreviewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevPreviewRef.current) {
        URL.revokeObjectURL(prevPreviewRef.current);
      }
    };
  }, []);

  if (user === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-300" />
      </div>
    );
  }

  const currentImage = previewImage || user?.image || "";

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file" });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    if (prevPreviewRef.current) {
      URL.revokeObjectURL(prevPreviewRef.current);
    }
    prevPreviewRef.current = objectUrl;
    setPreviewImage(objectUrl);
    setIsUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");

      const { storageId } = (await result.json()) as { storageId: string };
      const url = await getStorageUrl({
        storageId: storageId as Id<"_storage">,
      });
      await updateUser({ image: url });
    } catch {
      toast({ title: "Failed to upload image" });
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === user?.name) return;
    setIsSaving(true);
    try {
      await updateUser({ name: trimmed });
      toast({ title: "Profile updated" });
    } catch {
      toast({ title: "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const hasNameChanged = name.trim() && name.trim() !== user?.name;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-nosifer text-2xl text-purple-300">Settings</h1>
      <p className="mt-1 font-special text-sm text-purple-400">
        Manage your profile and display preferences
      </p>

      <div className="mt-8 space-y-6">
        <Card className="border-purple-700 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="font-special text-lg text-purple-300">
              Profile Picture
            </CardTitle>
            <CardDescription className="font-special text-sm text-purple-400">
              Upload a photo to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentImage} />
                <AvatarFallback className="bg-purple-700/30 text-2xl text-purple-300">
                  {(user?.name ?? "??").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
            <p className="font-special text-sm text-purple-400">
              JPG, PNG or GIF. 1MB max.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-700 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="font-special text-lg text-purple-300">
              Display Name
            </CardTitle>
            <CardDescription className="font-special text-sm text-purple-400">
              This is how your name will appear across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="font-special text-sm text-purple-300"
              >
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user?.name || "Your display name"}
                className="border-purple-700 bg-gray-800 font-special text-purple-300 placeholder:text-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-special text-sm text-purple-300"
              >
                Email
              </Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                disabled
                className="border-purple-700 bg-gray-800 font-special text-purple-400 opacity-60"
              />
              <p className="font-special text-xs text-purple-500">
                Email cannot be changed
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving || !hasNameChanged}
              className="bg-purple-500 font-special text-white hover:bg-purple-700"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
