"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import type { ConversationStarter } from "../engine/types";

interface ConversationCardsProps {
  starters: ConversationStarter[];
}

export function ConversationCards({ starters }: ConversationCardsProps) {
  return (
    <Stack gap="md">
      <Text variant="heading" className="text-xl md:text-2xl">
        Conversation Starters
      </Text>
      <div className="grid gap-3">
        {starters.slice(0, 3).map((starter, index) => (
          <GlassCard
            key={starter.id}
            intensity="default"
            padding="lg"
            className="min-h-[5.5rem] touch-manipulation"
          >
            <Text variant="micro" className="mb-3 text-blue-200/60">
              Opener {index + 1}
            </Text>
            <Text
              variant="body"
              className="text-lg leading-relaxed md:text-xl"
            >
              “{starter.text}”
            </Text>
          </GlassCard>
        ))}
      </div>
    </Stack>
  );
}
