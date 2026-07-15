"use client";

import { LayoutGroup } from "framer-motion";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { CompanyRankingCard } from "./company-ranking-card";
import type { CompanyStanding } from "../engine/types";

interface CompanyRankingsProps {
  entries: CompanyStanding[];
  reduceMotion?: boolean;
}

export function CompanyRankings({
  entries,
  reduceMotion = false,
}: CompanyRankingsProps) {
  return (
    <Stack gap="md">
      <Text variant="eyebrow">Top 10 · Companies</Text>
      <LayoutGroup>
        <Stack gap="sm">
          {entries.map((entry) => (
            <CompanyRankingCard
              key={entry.id}
              entry={entry}
              reduceMotion={reduceMotion}
            />
          ))}
        </Stack>
      </LayoutGroup>
    </Stack>
  );
}
