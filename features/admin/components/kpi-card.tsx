"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { LiveValue } from "@/features/leaderboard/components/live-value";
import type { KpiDefinition } from "../config/types";

interface KpiCardProps {
  kpi: KpiDefinition;
}

export function KpiCard({ kpi }: KpiCardProps) {
  return (
    <GlassCard
      intensity="default"
      padding="lg"
      className="min-h-[8.5rem] touch-manipulation"
    >
      <Text variant="micro" className="mb-4 text-muted-foreground">
        {kpi.label}
      </Text>
      <LiveValue
        value={kpi.value}
        decimals={kpi.decimals ?? 0}
        suffix={kpi.suffix}
        className={cn(
          "text-4xl font-extrabold tracking-tight md:text-5xl",
          kpi.achievement ? "text-gradient-gold" : "text-foreground",
        )}
      />
    </GlassCard>
  );
}
