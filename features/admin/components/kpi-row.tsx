"use client";

import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { KpiCard } from "./kpi-card";
import type { KpiDefinition } from "../config/types";

interface KpiRowProps {
  kpis: KpiDefinition[];
}

export function KpiRow({ kpis }: KpiRowProps) {
  return (
    <Stack gap="md">
      <Text variant="heading" className="text-xl md:text-2xl">
        Live KPIs
      </Text>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </Stack>
  );
}
