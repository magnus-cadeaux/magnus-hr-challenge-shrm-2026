"use client";

import { LayoutGroup } from "framer-motion";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { SignatureDistributionCard } from "./signature-distribution-card";
import type { SignatureShare } from "../engine/types";

interface SignatureDistributionProps {
  entries: SignatureShare[];
  reduceMotion?: boolean;
}

export function SignatureDistribution({
  entries,
  reduceMotion = false,
}: SignatureDistributionProps) {
  return (
    <Stack gap="md">
      <Text variant="eyebrow">HR Signature Distribution</Text>
      <LayoutGroup>
        <div className="grid gap-3 md:grid-cols-2">
          {entries.map((entry, index) => (
            <SignatureDistributionCard
              key={entry.id}
              entry={entry}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </LayoutGroup>
    </Stack>
  );
}
