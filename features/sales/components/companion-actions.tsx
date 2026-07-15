"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { ROUTES } from "@/lib/constants";
import type { LeadIntelligenceProfile } from "../engine/types";
import {
  buildExportSummaryPlaceholder,
  clearParticipantLocalSession,
  markConversationComplete,
  readSalesNotes,
} from "../engine/session-reader";

interface CompanionActionsProps {
  profile: LeadIntelligenceProfile;
  conversationComplete: boolean;
  onMarkedComplete: () => void;
}

export function CompanionActions({
  profile,
  conversationComplete,
  onMarkedComplete,
}: CompanionActionsProps) {
  const router = useRouter();
  const [exportHint, setExportHint] = useState<string | null>(null);

  const onExport = async () => {
    const notes = readSalesNotes(profile.sessionId);
    const summary = buildExportSummaryPlaceholder(profile, notes);
    try {
      await navigator.clipboard.writeText(summary);
      setExportHint("Summary copied to clipboard (placeholder).");
    } catch {
      setExportHint("Export placeholder ready — clipboard unavailable.");
    }
    window.setTimeout(() => setExportHint(null), 2800);
  };

  const onComplete = () => {
    markConversationComplete(profile.sessionId);
    onMarkedComplete();
  };

  const onNewParticipant = () => {
    clearParticipantLocalSession();
    router.push(ROUTES.home);
  };

  return (
    <Stack gap="md">
      <div className="grid gap-3 sm:grid-cols-3">
        <Button
          size="lg"
          variant={conversationComplete ? "achievement" : "default"}
          className="min-h-14 w-full"
          onClick={onComplete}
        >
          {conversationComplete
            ? "Conversation Marked"
            : "Mark Conversation Complete"}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="min-h-14 w-full"
          onClick={onExport}
        >
          Export Summary
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="min-h-14 w-full"
          onClick={onNewParticipant}
        >
          Start New Participant
        </Button>
      </div>
      {exportHint ? (
        <Text variant="caption" className="text-center text-blue-200/80">
          {exportHint}
        </Text>
      ) : null}
    </Stack>
  );
}
