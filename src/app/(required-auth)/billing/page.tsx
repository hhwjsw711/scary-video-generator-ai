"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  Check,
  CreditCard,
  Loader2,
  Receipt,
  Settings,
  Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

const CREDIT_PACKS = [
  {
    key: "starter",
    label: "Starter",
    credits: 1000,
    description: "Good for trying out AI video generation",
    icon: Zap,
    popular: false,
  },
  {
    key: "pro",
    label: "Pro",
    credits: 3500,
    description: "Best value for regular creators",
    icon: Zap,
    popular: true,
  },
  {
    key: "team",
    label: "Team",
    credits: 15000,
    description: "For teams producing content at scale",
    icon: Zap,
    popular: false,
  },
] as const;

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingLoading />}>
      <BillingContent />
    </Suspense>
  );
}

function BillingLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-300" />
    </div>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useQuery(api.users.viewer);
  const teams = useQuery(api.teams.list);
  const createCheckout = useAction(api.stripe.createCreditCheckout);
  const createPortal = useAction(api.stripe.createCustomerPortal);

  const [selectedTeam, setSelectedTeam] = useState<Id<"teams"> | null>(null);
  const [targetType, setTargetType] = useState<"personal" | "team">("personal");
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const personalTransactions = useQuery(api.credits.getUserTransactions);
  const teamTransactions = useQuery(
    api.credits.getTeamTransactions,
    targetType === "team" && selectedTeam
      ? { teamId: selectedTeam }
      : "skip",
  );

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: "Payment successful!",
        description: "Your credits have been added to your account.",
      });
      router.replace("/billing");
    }
    if (searchParams.get("canceled") === "true") {
      toast({
        title: "Payment canceled",
        description: "No charges were made to your account.",
      });
      router.replace("/billing");
    }
  }, [searchParams, router]);

  const handlePurchase = async (
    pack: "starter" | "pro" | "team",
  ) => {
    if (targetType === "team" && !selectedTeam) {
      toast({ title: "Please select a team first" });
      return;
    }
    setIsCheckingOut(pack);
    try {
      const result = await createCheckout({
        pack,
        targetType,
        teamId: selectedTeam ?? undefined,
      });
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast({ title: "Failed to create checkout session" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsCheckingOut(null);
    }
  };

  const handleOpenPortal = async () => {
    setIsOpeningPortal(true);
    try {
      const result = await createPortal();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      toast({ title: "Failed to open customer portal" });
    } finally {
      setIsOpeningPortal(false);
    }
  };

  if (user === undefined) {
    return <BillingLoading />;
  }

  const isAdmin =
    targetType === "team" &&
    selectedTeam &&
    teams?.find((t) => t._id === selectedTeam)?.role === "admin";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-nosifer text-2xl text-purple-300 md:text-[40px]">
            Billing
          </h1>
          <p className="mt-1 font-special text-sm text-purple-400">
            Purchase credits and manage your billing
          </p>
        </div>
        <Button
          onClick={handleOpenPortal}
          disabled={isOpeningPortal}
          variant="outline"
          className="border-purple-700 text-purple-300 hover:bg-purple-700 hover:text-white"
        >
          {isOpeningPortal ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Settings className="mr-2 h-4 w-4" />
          )}
          <span className="font-special text-sm">Manage Billing</span>
        </Button>
      </div>

      {/* Current Credits */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-purple-700 bg-gray-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-special text-lg text-purple-300">
              Personal Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-nosifer text-4xl text-white">
              {user?.credits ?? 0}
            </div>
          </CardContent>
        </Card>
        {teams && teams.length > 0 && (
          <Card className="border-purple-700 bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-special text-lg text-purple-300">
                Team Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTeam ? (
                <div className="font-nosifer text-4xl text-white">
                  {teams.find((t) => t._id === selectedTeam)?.credits ?? 0}
                </div>
              ) : (
                <p className="font-special text-sm text-purple-500">
                  Select a team below to view credits
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Purchase Target Selector */}
      <div className="mt-8 flex items-center gap-4">
        <Tabs
          value={targetType}
          onValueChange={(v) => {
            setTargetType(v as "personal" | "team");
            setSelectedTeam(null);
          }}
        >
          <TabsList className="bg-gray-800">
            <TabsTrigger
              value="personal"
              className="font-special text-purple-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Personal
            </TabsTrigger>
            {teams && teams.length > 0 && (
              <TabsTrigger
                value="team"
                className="font-special text-purple-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
              >
                Team
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>

        {targetType === "team" && teams && teams.length > 0 && (
          <Select
            value={selectedTeam ?? ""}
            onValueChange={(v) => setSelectedTeam(v as Id<"teams">)}
          >
            <SelectTrigger className="w-[200px] border-purple-700 bg-gray-800 font-special text-purple-300">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900">
              {teams.map((team) => (
                <SelectItem
                  key={team._id}
                  value={team._id}
                  className="font-special text-purple-300 focus:bg-purple-700 focus:text-white"
                  disabled={team.role !== "admin"}
                >
                  {team.name}
                  {team.role !== "admin" && " (admin only)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Credit Packs */}
      <div className="mt-8">
        <h2 className="font-special text-xl font-bold text-purple-300">
          {targetType === "personal"
            ? "Purchase Credits"
            : selectedTeam
              ? `Purchase Credits for ${teams?.find((t) => t._id === selectedTeam)?.name}`
              : "Purchase Credits"}
        </h2>
        <p className="mt-1 font-special text-sm text-purple-400">
          {targetType === "team" && !selectedTeam
            ? "Select a team to purchase credits"
            : targetType === "team" && !isAdmin
              ? "Only team admins can purchase credits"
              : "Choose a credit pack that fits your needs"}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CREDIT_PACKS.map((pack) => {
            const isLoading = isCheckingOut === pack.key;
            const isDisabled =
              (targetType === "team" && !selectedTeam) ||
              (targetType === "team" && !isAdmin);

            return (
              <Card
                key={pack.key}
                className={`relative border-purple-700 bg-gray-900/50 transition-all hover:border-purple-500 ${
                  pack.popular ? "ring-2 ring-purple-500" : ""
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-500 px-3 py-1">
                    <span className="font-special text-xs font-bold text-white">
                      Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="font-special text-xl text-purple-300">
                    {pack.label}
                  </CardTitle>
                  <CardDescription className="font-special text-sm text-purple-400">
                    {pack.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-nosifer text-3xl text-white">
                      {pack.credits.toLocaleString()}
                    </span>
                    <span className="font-special text-sm text-purple-400">
                      credits
                    </span>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 font-special text-sm text-purple-300">
                      <Check className="h-4 w-4 text-purple-500" />
                      {targetType === "personal"
                        ? "For personal stories"
                        : "Shared team pool"}
                    </li>
                    <li className="flex items-center gap-2 font-special text-sm text-purple-300">
                      <Check className="h-4 w-4 text-purple-500" />
                      Instant delivery
                    </li>
                    <li className="flex items-center gap-2 font-special text-sm text-purple-300">
                      <Check className="h-4 w-4 text-purple-500" />
                      No expiration
                    </li>
                  </ul>

                  <Button
                    onClick={() => handlePurchase(pack.key)}
                    disabled={isLoading || isDisabled}
                    className="w-full bg-purple-500 font-special text-white hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? "Processing..." : "Purchase"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-12">
        <h2 className="flex items-center gap-2 font-special text-xl font-bold text-purple-300">
          <Receipt className="h-5 w-5" />
          Transaction History
        </h2>

        {(() => {
          const txs =
            targetType === "team" && selectedTeam
              ? teamTransactions
              : personalTransactions;
          const label =
            targetType === "team" && selectedTeam
              ? teams?.find((t) => t._id === selectedTeam)?.name ?? "Team"
              : "Personal";

          if (txs === undefined) {
            return (
              <div className="mt-4 flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-300" />
              </div>
            );
          }

          if (txs.length === 0) {
            return (
              <Card className="mt-4 border-purple-700 bg-gray-900/50">
                <CardContent className="py-8 text-center">
                  <p className="font-special text-sm text-purple-400">
                    No {label.toLowerCase()} transactions yet
                  </p>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card className="mt-4 border-purple-700 bg-gray-900/50">
              <CardContent className="p-0">
                <div className="divide-y divide-purple-700/50">
                  {txs.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div className="flex-1">
                        <p className="font-special text-sm text-purple-300">
                          {tx.description}
                        </p>
                        <p className="font-special text-xs text-purple-500">
                          {tx.teamId
                            ? `Team • ${new Date(tx._creationTime).toLocaleDateString()}`
                            : `Personal • ${new Date(tx._creationTime).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-special text-lg font-bold ${
                            tx.amount > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {tx.amount > 0 ? "+" : ""}
                          {tx.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })()}
      </div>
    </div>
  );
}
