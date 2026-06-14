"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeftIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

export default function TeamDetailPage({
  params,
}: {
  params: { teamId: Id<"teams"> };
}) {
  const team = useQuery(api.teams.get, { teamId: params.teamId });
  const members = useQuery(api.teamMembers.listByTeam, {
    teamId: params.teamId,
  });
  const addMember = useMutation(api.teamMembers.add);
  const updateRole = useMutation(api.teamMembers.updateRole);
  const removeMember = useMutation(api.teamMembers.remove);
  const deleteTeam = useMutation(api.teams.remove);
  const editTeam = useMutation(api.teams.update);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addMember({ teamId: params.teamId, email, role });
      setEmail("");
      setRole("editor");
      setShowAddForm(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTeam = async () => {
    setIsDeleting(true);
    try {
      await deleteTeam({ teamId: params.teamId });
      window.location.href = "/teams";
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveMember = async (memberId: Id<"teamMembers">) => {
    await removeMember({ memberId });
  };

  const handleRoleChange = async (
    memberId: Id<"teamMembers">,
    newRole: string,
  ) => {
    await updateRole({
      memberId,
      role: newRole as "admin" | "editor" | "viewer",
    });
  };

  const handleEditTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      await editTeam({
        teamId: params.teamId,
        name: editName,
        description: editDescription,
      });
      setShowEditForm(false);
    } finally {
      setIsEditing(false);
    }
  };

  const openEditForm = () => {
    setEditName(team?.name ?? "");
    setEditDescription(team?.description ?? "");
    setShowEditForm(true);
  };

  if (team === undefined || members === undefined) {
    return (
      <div className="container flex h-full items-center justify-center py-12">
        <div
          className={cn("font-kecal text-[40px] font-bold text-purple-300")}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (team === null) {
    return (
      <div className="container flex h-full flex-col items-center justify-center gap-4 py-12">
        <p className={cn("font-kecal text-[40px] font-bold text-purple-300")}>
          Team not found
        </p>
        <Button asChild className="bg-primary text-white hover:bg-primary/90">
          <Link href="/teams">Back to Teams</Link>
        </Button>
      </div>
    );
  }

  const isAdmin = team.role === "admin";

  return (
    <div className="container h-full py-12">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/teams"
          className="flex items-center gap-2 text-purple-300 transition-colors hover:text-white"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1
            className={cn(
              "font-kecal text-2xl font-bold text-purple-300 md:text-[40px]",
            )}
          >
            {team.name}
          </h1>
          <p className={cn("font-kecal text-lg text-purple-400")}>
            {team.description}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        {(isAdmin || team.role === "editor") && (
          <Button
            onClick={openEditForm}
            variant="outline"
            className="border-purple-700 text-purple-300 hover:bg-purple-700 hover:text-white"
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Edit Team
          </Button>
        )}
        {isAdmin && (
          <>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Member
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <TrashIcon className="mr-2 h-4 w-4" /> Delete Team
            </Button>
          </>
        )}
      </div>

      {showAddForm && (
        <div className="mb-8 rounded-lg border border-purple-700 bg-gray-900 p-6">
          <h2 className="mb-4 font-kecal text-[24px] font-bold text-purple-300">
            Add Team Member
          </h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="flex gap-4">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="User email"
                type="email"
                required
                className="flex-1 border-purple-700 bg-gray-800 text-purple-300 placeholder:text-purple-500"
              />
              <Select
                value={role}
                onValueChange={(value) =>
                  setRole(value as "admin" | "editor" | "viewer")
                }
              >
                <SelectTrigger className="w-[150px] border-purple-700 bg-gray-800 text-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-purple-700 bg-gray-900 text-purple-300">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isAdding}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isAdding ? "Adding..." : "Add"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-purple-700 text-purple-300 hover:bg-purple-700 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && (
        <div className="mb-8 rounded-lg border border-purple-700 bg-gray-900 p-6">
          <h2 className="mb-4 font-kecal text-[24px] font-bold text-purple-300">
            Edit Team
          </h2>
          <form onSubmit={handleEditTeam} className="space-y-4">
            <div>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Team name"
                required
                className="border-purple-700 bg-gray-800 text-purple-300 placeholder:text-purple-500"
              />
            </div>
            <div>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                required
                className="border-purple-700 bg-gray-800 text-purple-300 placeholder:text-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isEditing}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isEditing ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditForm(false)}
                className="border-purple-700 text-purple-300 hover:bg-purple-700 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg border border-purple-700 bg-gray-900 p-6">
        <h2 className="mb-4 font-kecal text-[24px] font-bold text-purple-300">
          Team Members ({members.length})
        </h2>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between rounded-lg border border-purple-800 bg-gray-800 p-4"
            >
              <div>
                <p className="font-kecal text-purple-200">
                  {member.userName}
                </p>
                <p className="font-kecal text-sm text-purple-400">
                  {member.userEmail}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && member.role !== "admin" ? (
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      handleRoleChange(member._id, value)
                    }
                  >
                    <SelectTrigger className="w-[120px] border-purple-700 bg-gray-900 text-purple-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-purple-700 bg-gray-900 text-purple-300">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className={cn(
                      "rounded px-3 py-1 text-xs font-medium capitalize",
                      member.role === "admin"
                        ? "bg-purple-700 text-white"
                        : member.role === "editor"
                          ? "bg-purple-600 text-white"
                          : "bg-purple-800 text-purple-200",
                    )}
                  >
                    {member.role}
                  </span>
                )}
                {isAdmin && member.role !== "admin" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-purple-400 hover:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-center font-kecal text-purple-400">
              No members yet
            </p>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg border border-purple-700 bg-gray-900 p-6">
            <h2 className="mb-4 font-kecal text-[24px] font-bold text-purple-300">
              Delete Team?
            </h2>
            <p className="mb-4 font-kecal text-purple-400">
              This action cannot be undone. All team data will be permanently
              deleted.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteTeam}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-purple-700 text-purple-300 hover:bg-purple-700 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
