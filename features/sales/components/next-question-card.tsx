"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";

interface NextQuestionCardProps {
  question: string;
}

export function NextQuestionCard({ question }: NextQuestionCardProps) {
  return (
    <Stack gap="md">
      <Text variant="heading" className="text-xl md:text-2xl">
        Recommended Next Question
      </Text>
      <GlassCard intensity="strong" padding="xl" gradientBorder>
        <Text variant="eyebrow" className="mb-4 text-achievement">
          Ask this next
        </Text>
        <Text
          variant="heading"
          className="text-2xl leading-snug text-balance md:text-3xl"
        >
          “{question}”
        </Text>
      </GlassCard>
    </Stack>
  );
}
