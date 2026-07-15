"use client";

import { m } from "framer-motion";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import {
  PROFILE_DIMENSIONS,
  PROFILE_DIMENSION_LABELS,
  type ProfileScores,
} from "../engine/types";

interface StrengthBarsProps {
  scores: ProfileScores;
  reduceMotion?: boolean;
}

export function StrengthBars({
  scores,
  reduceMotion = false,
}: StrengthBarsProps) {
  const ordered = [...PROFILE_DIMENSIONS].sort(
    (a, b) => scores[b] - scores[a],
  );

  return (
    <Stack gap="md" className="w-full">
      <Text variant="heading">Leadership Strengths</Text>
      <Stack gap="sm" className="w-full">
        {ordered.map((dimension, index) => (
          <div key={dimension} className="w-full">
            <div className="mb-2 flex items-center justify-between gap-3">
              <Text variant="caption" className="text-foreground">
                {PROFILE_DIMENSION_LABELS[dimension]}
              </Text>
              <Text variant="caption" className="tabular-nums text-blue-300">
                {Math.round(scores[dimension])}
              </Text>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <m.div
                className="h-full rounded-full bg-gradient-blue"
                initial={{ width: reduceMotion ? `${scores[dimension]}%` : 0 }}
                whileInView={{ width: `${scores[dimension]}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: reduceMotion ? 0.2 : durations.reveal,
                  ease: easings.outExpo,
                  delay: reduceMotion ? 0 : index * 0.06,
                }}
              />
            </div>
          </div>
        ))}
      </Stack>
    </Stack>
  );
}
