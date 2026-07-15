"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { ConversationStatus, RecentParticipant } from "../config/types";

const STATUS_LABEL: Record<ConversationStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  complete: "Complete",
};

const STATUS_CLASS: Record<ConversationStatus, string> = {
  pending: "bg-white/10 text-blue-100/80",
  in_progress: "bg-blue-500/20 text-blue-200",
  complete: "bg-emerald-400/15 text-emerald-200",
};

interface ParticipantOpCardProps {
  participant: RecentParticipant;
}

export function ParticipantOpCard({ participant }: ParticipantOpCardProps) {
  return (
    <GlassCard
      intensity="subtle"
      padding="md"
      className="min-h-[7.5rem] touch-manipulation"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Text variant="heading" className="truncate text-lg">
            {participant.name}
          </Text>
          <Text variant="caption" className="truncate">
            {participant.company}
            <span className="mx-2 text-white/20">·</span>
            {participant.completedAt}
          </Text>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
            STATUS_CLASS[participant.conversationStatus],
          )}
        >
          {STATUS_LABEL[participant.conversationStatus]}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <Text variant="micro" className="mb-1 text-muted-foreground">
            Signature
          </Text>
          <Text variant="caption" className="text-sm text-blue-50">
            {participant.signature}
          </Text>
        </div>
        <div>
          <Text variant="micro" className="mb-1 text-muted-foreground">
            Gift
          </Text>
          <Text variant="caption" className="text-sm text-blue-50">
            {participant.gift}
          </Text>
        </div>
        <div>
          <Text variant="micro" className="mb-1 text-muted-foreground">
            Lead Score
          </Text>
          <Text
            as="div"
            className="text-xl font-extrabold tabular-nums text-gradient-blue"
          >
            {participant.leadScore}
          </Text>
        </div>
      </div>
    </GlassCard>
  );
}
