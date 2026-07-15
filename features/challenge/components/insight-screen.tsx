"use client";

import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Eyebrow, Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";

interface InsightScreenProps {
  insight: string;
  onContinue: () => void;
  reduceMotion?: boolean;
}

export function InsightScreen({
  insight,
  onContinue,
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
          <Button
            size="lg"
            className="mt-2 min-h-14 w-full sm:w-auto sm:min-w-[12rem]"
            motionDisabled={reduceMotion}
            onClick={onContinue}
          >
            Continue
          </Button>
        </Stack>
      </GlassCard>
    </m.div>
  );
}
