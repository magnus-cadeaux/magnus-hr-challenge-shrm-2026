"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { exportCsv } from "@/lib/exports";
import { clearParticipantSession } from "@/lib/kiosk";
import {
  clearAllTestData,
  resetLeaderboardToday,
  resetRewardCounters,
  startNewLeaderboardDay,
} from "../actions/operational";
import type { QuickActionDefinition, QuickActionId } from "../config/types";

interface QuickActionsRowProps {
  actions: QuickActionDefinition[];
  onDataChange?: () => void;
}

export function QuickActionsRow({
  actions,
  onDataChange,
}: QuickActionsRowProps) {
  const [flash, setFlash] = useState<string | null>(null);

  const onAction = async (action: QuickActionDefinition) => {
    try {
      switch (action.id) {
        case "export_participants":
          await exportCsv("participants");
          setFlash("Participants CSV downloaded.");
          break;
        case "export_leads":
          await exportCsv("leads");
          setFlash("Leads CSV downloaded.");
          break;
        case "export_inventory":
          await exportCsv("inventory");
          setFlash("Inventory CSV downloaded.");
          break;
        case "reset_demo":
          clearParticipantSession();
          setFlash("Participant session cleared on this device.");
          break;
        case "reset_leaderboard": {
          if (
            !window.confirm(
              "Reset today's leaderboard? This clears arena standings for the current event day.",
            )
          ) {
            return;
          }
          const { deleted } = await resetLeaderboardToday();
          onDataChange?.();
          setFlash(
            deleted > 0
              ? `Leaderboard cleared (${deleted} local entries).`
              : "Leaderboard cleared for the current event day.",
          );
          break;
        }
        case "reset_rewards": {
          if (
            !window.confirm(
              "Reset reward counters? Reserved and distributed will be set to 0. Stock is unchanged.",
            )
          ) {
            return;
          }
          await resetRewardCounters();
          onDataChange?.();
          setFlash("Reward reserved/distributed counters reset to 0.");
          break;
        }
        case "start_new_day": {
          if (
            !window.confirm(
              "Start a new event day? The leaderboard will show empty standings for the new day.",
            )
          ) {
            return;
          }
          const day = startNewLeaderboardDay();
          onDataChange?.();
          setFlash(`New event day started: ${day}`);
          break;
        }
        case "clear_all_test_data": {
          const typed = window.prompt(
            'Type CLEAR to wipe all test participant data (participants, sessions, answers, signatures, rewards, leaderboard). Inventory stock is kept.',
          );
          if (typed == null) return;
          if (typed.trim() !== "CLEAR") {
            setFlash('Cancelled — type CLEAR exactly to confirm.');
            break;
          }
          const { cleared } = await clearAllTestData();
          onDataChange?.();
          setFlash(
            cleared > 0
              ? `Test data cleared (${cleared} local records).`
              : "Test data cleared.",
          );
          break;
        }
        default:
          setFlash(`Queued: ${action.label}`);
      }
    } catch {
      setFlash(`Could not complete: ${action.label}`);
    }
    window.setTimeout(() => setFlash(null), 2400);
  };

  const variantFor = (
    tone: QuickActionDefinition["tone"],
  ): "default" | "secondary" | "outline" => {
    if (tone === "default") return "default";
    if (tone === "caution") return "outline";
    return "secondary";
  };

  return (
    <Stack gap="md">
      <div className="flex items-end justify-between gap-3">
        <Text variant="heading" className="text-xl md:text-2xl">
          Quick Actions
        </Text>
        {flash ? (
          <Text variant="caption" className="text-blue-200/80">
            {flash}
          </Text>
        ) : (
          <Text variant="caption">Operational actions</Text>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <GlassCard
            key={action.id}
            intensity="subtle"
            padding="md"
            className="flex flex-col gap-4"
          >
            <div>
              <Text variant="heading" className="text-lg">
                {action.label}
              </Text>
              <Text variant="caption" className="mt-1">
                {action.description}
              </Text>
            </div>
            <Button
              size="lg"
              variant={variantFor(action.tone)}
              className={cn(
                "mt-auto min-h-12 w-full",
                action.tone === "caution" && "border-amber-400/30 text-amber-100",
              )}
              onClick={() => void onAction(action)}
              data-action={action.id as QuickActionId}
            >
              {action.label}
            </Button>
          </GlassCard>
        ))}
      </div>
    </Stack>
  );
}
