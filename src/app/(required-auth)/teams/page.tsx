"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

export default function Page() {
  const teams = useQuery(api.teams.list);
  const createTeam = useMutation(api.teams.create);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createTeam({ name, description });
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container h-full py-12">
      <h1
        className={cn(
          "w-full text-center font-kecal text-2xl font-bold text-purple-300 md:text-[40px]",
        )}
      >
        Your Teams
      </h1>

      <div className="flex justify-end py-4">
        <Button
          onClick={() => setShowCreateForm(true)}
          className={cn("font-kecal text-[24px]")}
        >
          <PlusIcon className="mr-2 h-5 w-5" /> New Team
        </Button>
      </div>

      {showCreateForm && (
        <div className="mx-auto mb-8 max-w-lg rounded-lg border border-purple-700 bg-gray-900 p-6">
          <h2 className="mb-4 font-kecal text-[24px] font-bold text-purple-300">
            Create New Team
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team name"
                required
                className="border-purple-700 bg-gray-800 text-purple-300 placeholder:text-purple-500"
              />
            </div>
            <div>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="border-purple-700 bg-gray-800 text-purple-300 placeholder:text-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="border-purple-700 text-purple-300 hover:bg-purple-700 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {teams === undefined ? (
        <div className="flex h-full items-center justify-center">
          <div className={cn("font-kecal text-[40px] font-bold")}>
            Loading teams...
          </div>
        </div>
      ) : teams.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
          <UsersIcon className="h-16 w-16 text-purple-500" />
          <p
            className={cn("font-kecal text-[40px] font-bold text-purple-300")}
          >
            No teams yet
          </p>
          <p className={cn("font-kecal text-lg text-purple-400")}>
            Create a team to start collaborating
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({
  team,
}: {
  team: {
    _id: Id<"teams">;
    name?: string;
    description?: string;
    role?: string;
  };
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/teams/${team._id}`)}
      className="flex min-h-[200px] flex-col items-start justify-between rounded-xl border-2 border-purple-500 bg-gray-900 p-6 text-left transition-all hover:scale-105 hover:border-purple-300 md:min-h-[250px]"
    >
      <div>
        <h3 className="mb-2 font-kecal text-[28px] font-bold text-purple-300">
          {team.name}
        </h3>
        <p className="line-clamp-3 font-kecal text-sm text-purple-400">
          {team.description}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span
          className={cn(
            "rounded px-2 py-1 text-xs font-medium capitalize",
            team.role === "admin"
              ? "bg-purple-700 text-white"
              : team.role === "editor"
                ? "bg-purple-600 text-white"
                : "bg-purple-800 text-purple-200",
          )}
        >
          {team.role}
        </span>
      </div>
    </button>
  );
}
