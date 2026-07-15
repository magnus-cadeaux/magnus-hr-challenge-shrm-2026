"use client";

import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { ParticipantOpCard } from "./participant-op-card";
import type { RecentParticipant } from "../config/types";

interface OperationsRowProps {
  participants: RecentParticipant[];
}

export function OperationsRow({ participants }: OperationsRowProps) {
  return (
    <Stack gap="md">
      <div className="flex items-end justify-between gap-3">
        <Text variant="heading" className="text-xl md:text-2xl">
          Team Operations
        </Text>
        <Text variant="caption">Recent participants · last 10</Text>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {participants.map((participant) => (
          <ParticipantOpCard key={participant.id} participant={participant} />
        ))}
      </div>
    </Stack>
  );
}
