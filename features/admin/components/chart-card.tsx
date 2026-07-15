"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { VerticalBars } from "./vertical-bars";
import { HorizontalBars } from "./horizontal-bars";
import type { ChartDefinition } from "../config/types";

interface ChartCardProps {
  chart: ChartDefinition;
  reduceMotion?: boolean;
}

export function ChartCard({ chart, reduceMotion = false }: ChartCardProps) {
  return (
    <GlassCard intensity="default" padding="lg" className="h-full">
      <Text variant="heading" className="mb-1 text-xl">
        {chart.title}
      </Text>
      <Text variant="caption" className="mb-6">
        {chart.subtitle}
      </Text>
      {chart.kind === "vertical" ? (
        <VerticalBars points={chart.points} reduceMotion={reduceMotion} />
      ) : (
        <HorizontalBars points={chart.points} reduceMotion={reduceMotion} />
      )}
    </GlassCard>
  );
}
