"use client";

import {
  Award,
  Building2,
  Gift,
  Sparkles,
  Users,
} from "lucide-react";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { GlassCard } from "@/components/ui/glass-card";
import { ArenaStatCard } from "./arena-stat-card";
import type { ArenaStats } from "../engine/types";

interface SideStatsProps {
  stats: ArenaStats;
}

export function SideStats({ stats }: SideStatsProps) {
  return (
    <GlassCard intensity="panel" padding="lg" className="h-full">
      <Stack gap="lg">
        <div>
          <Text variant="eyebrow" className="mb-2">
            Live panel
          </Text>
          <Text variant="heading" className="text-2xl">
            Today&apos;s Stats
          </Text>
        </div>

        <div className="grid gap-3">
          <ArenaStatCard
            label="Participants"
            value={stats.participants}
            icon={Users}
          />
          <ArenaStatCard
            label="Average Score"
            value={stats.averageScore}
            decimals={1}
            icon={Sparkles}
          />
          <ArenaStatCard
            label="Rewards Collected"
            value={stats.rewardsCollected}
            icon={Gift}
            achievement
          />
          <ArenaStatCard
            label="Companies Represented"
            value={stats.companiesRepresented}
            icon={Building2}
          />
          <ArenaStatCard
            label="Most Popular Signature"
            display={stats.mostPopularSignature}
            icon={Award}
            achievement
          />
        </div>
      </Stack>
    </GlassCard>
  );
}
