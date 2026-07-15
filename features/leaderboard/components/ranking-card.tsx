"use client";

import { m } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/design-system/motion";
import { LiveValue } from "./live-value";
import { MovementIndicator } from "./movement-indicator";
import type { IndividualStanding } from "../engine/types";

interface RankingCardProps {
  entry: IndividualStanding;
  reduceMotion?: boolean;
}

export function RankingCard({
  entry,
  reduceMotion = false,
}: RankingCardProps) {
  const isLead = entry.rank === 1;

  return (
    <m.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { duration: durations.slow, ease: easings.outExpo },
        opacity: { duration: durations.base },
        y: { duration: durations.base, ease: easings.outExpo },
      }}
      style={{ willChange: "transform, opacity" }}
    >
      <GlassCard
        intensity={isLead ? "strong" : "default"}
        padding="md"
        gradientBorder={isLead}
        className={cn(
          "grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6",
          isLead && "shadow-[0_0_40px_-12px_rgba(59,130,246,0.45)]",
        )}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-xl text-2xl font-extrabold tabular-nums md:size-14 md:text-3xl",
              isLead
                ? "bg-blue-500/20 text-blue-100"
                : "bg-white/5 text-blue-200/80",
            )}
          >
            {entry.rank}
          </span>
          <MovementIndicator movement={entry.movement} />
        </div>

        <div className="min-w-0">
          <Text
            variant="heading"
            className="truncate text-xl md:text-2xl"
          >
            {entry.name}
          </Text>
          <Text variant="caption" className="truncate text-base text-blue-100/60">
            {entry.company}
            <span className="mx-2 text-white/20">·</span>
            {entry.signatureName}
          </Text>
        </div>

        <LiveValue
          value={entry.score}
          decimals={1}
          className={cn(
            "text-3xl font-extrabold tracking-tight md:text-4xl",
            isLead ? "text-gradient-blue" : "text-foreground",
          )}
        />
      </GlassCard>
    </m.div>
  );
}
