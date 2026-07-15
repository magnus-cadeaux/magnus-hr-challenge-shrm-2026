"use client";

import { m } from "framer-motion";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import type { ChartPoint } from "../config/types";

interface HorizontalBarsProps {
  points: ChartPoint[];
  reduceMotion?: boolean;
}

export function HorizontalBars({
  points,
  reduceMotion = false,
}: HorizontalBarsProps) {
  const max = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {points.map((point, index) => {
        const width = `${(point.value / max) * 100}%`;
        return (
          <div key={point.id} className="grid gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <Text variant="caption" className="truncate text-sm text-blue-50">
                {point.label}
              </Text>
              <Text variant="micro" className="tabular-nums text-muted-foreground">
                {point.value}
              </Text>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <m.div
                className="h-full rounded-full bg-gradient-blue"
                initial={reduceMotion ? { width } : { width: "6%" }}
                animate={{ width }}
                transition={{
                  duration: reduceMotion ? 0 : durations.reveal,
                  ease: easings.outExpo,
                  delay: reduceMotion ? 0 : index * 0.06,
                }}
                style={{ willChange: "width" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
