"use client";

import { LayoutGroup } from "framer-motion";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { RankingCard } from "./ranking-card";
import type { IndividualStanding } from "../engine/types";

interface IndividualRankingsProps {
  entries: IndividualStanding[];
  reduceMotion?: boolean;
}

export function IndividualRankings({
  entries,
  reduceMotion = false,
}: IndividualRankingsProps) {
  return (
    <Stack gap="md">
      <Text variant="eyebrow">Top 10 · Individuals</Text>
      <LayoutGroup>
        <Stack gap="sm">
          {entries.map((entry) => (
            <RankingCard
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
