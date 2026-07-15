"use client";

import { m } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Eyebrow, Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";

interface InsightScreenProps {
  insight: string;
  reduceMotion?: boolean;
}

export function InsightScreen({
  insight,
  reduceMotion = false,
}: InsightScreenProps) {
  return (
    <m.div
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 16, filter: "blur(8px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -10, filter: "blur(6px)" }
      }
      transition={{
        duration: reduceMotion ? durations.fast : durations.reveal,
        ease: easings.outExpo,
      }}
      style={{ willChange: "transform, opacity, filter" }}
      className="mx-auto flex w-full max-w-2xl items-center justify-center"
    >
      <GlassCard intensity="panel" padding="lg" className="w-full text-center">
        <Stack gap="md" align="center">
          <Eyebrow>Insight</Eyebrow>
          <Text variant="title" className="text-balance">
            Interesting choice.
          </Text>
          <Text variant="lead" className="max-w-xl text-pretty">
            {insight}
          </Text>
        </Stack>
      </GlassCard>
    </m.div>
  );
}
