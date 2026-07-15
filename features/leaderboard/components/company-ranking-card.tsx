"use client";

import { m } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/design-system/motion";
import { LiveValue } from "./live-value";
import { MovementIndicator } from "./movement-indicator";
import type { CompanyStanding } from "../engine/types";

interface CompanyRankingCardProps {
  entry: CompanyStanding;
  reduceMotion?: boolean;
}

export function CompanyRankingCard({
  entry,
  reduceMotion = false,
}: CompanyRankingCardProps) {
  const isLead = entry.rank === 1;

  return (
    <m.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { duration: durations.slow, ease: easings.outExpo },
        opacity: { duration: durations.base },
      }}
      style={{ willChange: "transform, opacity" }}
    >
      <GlassCard
        intensity={isLead ? "strong" : "default"}
        padding="md"
        gradientBorder={isLead}
        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-xl text-2xl font-extrabold tabular-nums md:size-14 md:text-3xl",
              isLead
                ? "bg-achievement/15 text-achievement"
                : "bg-white/5 text-blue-200/80",
            )}
          >
            {entry.rank}
          </span>
          <MovementIndicator movement={entry.movement} />
        </div>

        <div className="min-w-0">
          <Text variant="heading" className="truncate text-xl md:text-2xl">
            {entry.name}
          </Text>
          <Text variant="caption" className="text-base text-blue-100/60">
            {entry.participants} participant
            {entry.participants === 1 ? "" : "s"}
          </Text>
        </div>

        <div className="text-right">
          <LiveValue
            value={entry.averageScore}
            decimals={1}
            className={cn(
              "text-3xl font-extrabold tracking-tight md:text-4xl",
              isLead ? "text-gradient-gold" : "text-foreground",
            )}
          />
          <Text variant="micro" className="mt-1 block text-muted-foreground">
            Avg score
          </Text>
        </div>
      </GlassCard>
    </m.div>
  );
}
