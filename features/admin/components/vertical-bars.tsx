"use client";

import { m } from "framer-motion";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import type { ChartPoint } from "../config/types";

interface VerticalBarsProps {
  points: ChartPoint[];
  reduceMotion?: boolean;
}

export function VerticalBars({
  points,
  reduceMotion = false,
}: VerticalBarsProps) {
  const max = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="flex h-48 items-end gap-2 md:h-56 md:gap-3">
      {points.map((point, index) => {
        const height = `${(point.value / max) * 100}%`;
        return (
          <div
            key={point.id}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <Text variant="micro" className="tabular-nums text-blue-100/70">
              {point.value}
            </Text>
            <div className="relative flex w-full flex-1 items-end">
              <m.div
                className="w-full rounded-t-lg bg-gradient-blue"
                initial={
                  reduceMotion ? { height } : { height: "8%" }
                }
                animate={{ height }}
                transition={{
                  duration: reduceMotion ? 0 : durations.reveal,
                  ease: easings.outExpo,
                  delay: reduceMotion ? 0 : index * 0.05,
                }}
                style={{ willChange: "height", minHeight: 8 }}
              />
            </div>
            <Text variant="micro" className="text-muted-foreground">
              {point.label}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
