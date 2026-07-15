"use client";

import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { ChartCard } from "./chart-card";
import type { ChartDefinition } from "../config/types";

interface ChartsRowProps {
  charts: ChartDefinition[];
  reduceMotion?: boolean;
}

export function ChartsRow({ charts, reduceMotion = false }: ChartsRowProps) {
  return (
    <Stack gap="md">
      <Text variant="heading" className="text-xl md:text-2xl">
        Live Charts
      </Text>
      <div className="grid gap-4 lg:grid-cols-2">
        {charts.map((chart) => (
          <ChartCard
            key={chart.id}
            chart={chart}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </Stack>
  );
}
