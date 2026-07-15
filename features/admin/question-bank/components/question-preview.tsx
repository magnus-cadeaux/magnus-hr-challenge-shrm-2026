"use client";

import { QuestionScreen } from "@/features/challenge/components/question-screen";
import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { Stack } from "@/components/layout";
import type { ManagedQuestion } from "../types";
import { toChallengeConfig } from "../types";

interface QuestionPreviewProps {
  question: ManagedQuestion | null;
}

export function QuestionPreview({ question }: QuestionPreviewProps) {
  if (!question) {
    return (
      <GlassCard intensity="subtle" padding="lg">
        <Text variant="caption">Select a question to preview.</Text>
      </GlassCard>
    );
  }

  const prepared = {
    ...toChallengeConfig(question),
    sessionOrder: 1,
  };

  return (
    <Stack gap="md">
      <Text variant="eyebrow">Participant preview</Text>
      <div className="rounded-2xl border border-white/10 bg-navy-950/40 p-4 md:p-6">
        <QuestionScreen
          question={prepared}
          index={0}
          total={1}
          elapsedLabel="00:00"
          onAnswer={() => {
            /* preview only */
          }}
          disabled={false}
          reduceMotion
        />
      </div>
      {question.insight ? (
        <GlassCard intensity="subtle" padding="md">
          <Text variant="micro" className="mb-2">
            Post-answer explanation
          </Text>
          <Text variant="body">{question.insight}</Text>
        </GlassCard>
      ) : null}
    </Stack>
  );
}
