"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { LeadIntelligenceProfile } from "../engine/types";
import {
  formatChallengeDuration,
  formatConfidenceLabel,
  formatLeadScore,
  formatMaturityLabel,
} from "../lib/format";

interface ParticipantSummaryCardProps {
  profile: LeadIntelligenceProfile;
  primaryName: string;
  secondaryName: string;
}

function MetaBlock({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <Text variant="micro" className="mb-1.5 text-muted-foreground">
        {label}
      </Text>
      <Text
        as="div"
        className={cn(
          "truncate text-lg font-semibold tracking-tight md:text-xl",
          accent && "text-gradient-blue",
        )}
      >
        {value || "—"}
      </Text>
    </div>
  );
}

export function ParticipantSummaryCard({
  profile,
  primaryName,
  secondaryName,
}: ParticipantSummaryCardProps) {
  const { participant, signals } = profile;
  const phone = participant.phone
    ? participant.phone.startsWith("+")
      ? participant.phone
      : `+91 ${participant.phone}`
    : "—";

  return (
    <GlassCard intensity="strong" padding="lg" gradientBorder>
      <Stack gap="lg">
        <div>
          <Text variant="eyebrow" className="mb-2">
            Participant Summary
          </Text>
          <Text variant="title" className="text-3xl md:text-4xl">
            {participant.fullName || "Unnamed participant"}
          </Text>
          <Text variant="subtitle" className="mt-1 text-lg">
            {participant.organization || "Organisation not provided"}
          </Text>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <MetaBlock label="Email" value={participant.email || "—"} />
          <MetaBlock label="Mobile" value={phone} />
          <MetaBlock
            label="Challenge Duration"
            value={formatChallengeDuration(signals.behaviour.elapsedMs)}
          />
          <MetaBlock
            label="Magnus HR Signature™ · Primary"
            value={primaryName}
            accent
          />
          <MetaBlock
            label="Secondary"
            value={secondaryName}
          />
          <MetaBlock
            label="Lead Score"
            value={formatLeadScore(profile.leadScore)}
            accent
          />
          <MetaBlock
            label="Decision Confidence"
            value={formatConfidenceLabel(profile.decisionConfidence)}
          />
          <MetaBlock
            label="Organisation Maturity"
            value={formatMaturityLabel(profile.organisationMaturity)}
          />
        </div>
      </Stack>
    </GlassCard>
  );
}
