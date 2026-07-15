"use client";

import { m } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/design-system/motion";
import { LiveValue } from "./live-value";
import type { SignatureShare } from "../engine/types";

interface SignatureDistributionCardProps {
  entry: SignatureShare;
  index: number;
  reduceMotion?: boolean;
}

export function SignatureDistributionCard({
  entry,
  index,
  reduceMotion = false,
}: SignatureDistributionCardProps) {
  const highlight = index < 3;

  return (
    <m.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        layout: { duration: durations.slow, ease: easings.outExpo },
        duration: durations.base,
        delay: reduceMotion ? 0 : index * 0.04,
      }}
      style={{ willChange: "transform, opacity" }}
    >
      <GlassCard
        intensity={highlight ? "strong" : "subtle"}
        padding="lg"
        className="relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500/15 to-transparent"
          style={{ width: `${Math.min(entry.percentage, 100)}%` }}
          aria-hidden
        />
        <div className="relative flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Text variant="eyebrow" className="mb-2 text-blue-200/70">
              HR Signature
            </Text>
            <Text variant="heading" className="text-xl md:text-2xl">
              {entry.name}
            </Text>
          </div>
          <LiveValue
            value={entry.percentage}
            decimals={1}
            suffix="%"
            className={cn(
              "text-4xl font-extrabold tracking-tight md:text-5xl",
              highlight ? "text-gradient-blue" : "text-foreground",
            )}
          />
        </div>
        <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <m.div
            className="h-full rounded-full bg-gradient-blue"
            animate={{ width: `${Math.min(entry.percentage, 100)}%` }}
            transition={{
              duration: reduceMotion ? 0 : durations.slow,
              ease: easings.outExpo,
            }}
            style={{ willChange: "width" }}
          />
        </div>
      </GlassCard>
    </m.div>
  );
}
