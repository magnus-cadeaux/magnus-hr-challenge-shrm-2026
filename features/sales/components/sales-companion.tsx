"use client";

import { useEffect, useMemo, useState } from "react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { PageContainer } from "@/components/ui/page-container";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { ROUTES } from "@/lib/constants";
import { SIGNATURE_DEFINITIONS } from "@/features/signature/config/signatures";
import { readSignatureProfile } from "@/features/signature/engine";
import type { LeadIntelligenceProfile } from "../engine/types";
import {
  loadSalesCompanionProfile,
  readConversationComplete,
} from "../engine/session-reader";
import { ParticipantSummaryCard } from "./participant-summary-card";
import { InsightChipRow } from "./insight-chip-row";
import { RecommendationCards } from "./recommendation-cards";
import { ConversationCards } from "./conversation-cards";
import { NextQuestionCard } from "./next-question-card";
import { QuickNotes } from "./quick-notes";
import { CompanionActions } from "./companion-actions";

function resolveSignatureName(id: string): string {
  return (
    SIGNATURE_DEFINITIONS.find((item) => item.id === id)?.name ??
    id.replace(/_/g, " ")
  );
}

function EmptyCompanionState() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-6">
      <GradientBackground variant="hero" withOrb />
      <FloatingParticles density="sparse" className="opacity-30" />
      <GlassCard
        intensity="strong"
        padding="xl"
        className="relative z-10 max-w-lg text-center"
      >
        <Text variant="eyebrow" className="mb-3">
          Magnus internal
        </Text>
        <Text variant="title" className="mb-3">
          No participant session found
        </Text>
        <Text variant="subtitle" className="mb-8">
          Complete a booth challenge on this device first. The Sales Companion
          reads local Sprint artefacts only.
        </Text>
        <Button asChild size="lg">
          <a href={ROUTES.home}>Return to entry</a>
        </Button>
      </GlassCard>
    </div>
  );
}

export function SalesCompanion() {
  const [profile, setProfile] = useState<LeadIntelligenceProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);

  useEffect(() => {
    const loaded = loadSalesCompanionProfile();
    setProfile(loaded);
    if (loaded) {
      setConversationComplete(readConversationComplete(loaded.sessionId));
    }
    setReady(true);
  }, []);

  const signatureNames = useMemo(() => {
    if (!profile) {
      return { primary: "—", secondary: "—" };
    }
    const live = readSignatureProfile();
    return {
      primary:
        live?.primary.name ??
        resolveSignatureName(profile.signals.primarySignatureId),
      secondary:
        live?.secondary.name ??
        resolveSignatureName(profile.signals.secondarySignatureId),
    };
  }, [profile]);

  if (!ready) {
    return <LoadingScreen label="Loading sales companion" />;
  }

  if (!profile) {
    return <EmptyCompanionState />;
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <VisuallyHidden>
        <h1>Sales Companion</h1>
      </VisuallyHidden>

      <GradientBackground variant="hero" withOrb />
      <div className="pointer-events-none absolute inset-0 bg-navy-950/45" />
      <FloatingParticles density="sparse" tone="mixed" className="opacity-30" />

      <PageContainer className="relative z-10 py-8 md:py-12">
        <Stack gap="xl" className="mx-auto max-w-5xl pb-16">
          <header className="border-b border-white/10 pb-6">
            <Text variant="eyebrow" className="mb-2 text-blue-200/70">
              Magnus staff · booth only
            </Text>
            <Text variant="display" gradient="blue" className="tracking-tight">
              Sales Companion
            </Text>
            <Text variant="subtitle" className="mt-2 max-w-2xl text-lg">
              Meaningful conversation in fifteen seconds — from this
              participant&apos;s live floor session.
            </Text>
          </header>

          <ParticipantSummaryCard
            profile={profile}
            primaryName={signatureNames.primary}
            secondaryName={signatureNames.secondary}
          />

          <InsightChipRow
            title="Likely Priorities"
            items={profile.likelyPriorities.slice(0, 5)}
          />

          <InsightChipRow
            title="Likely Buying Interests"
            items={profile.likelyBuyingInterests.slice(0, 5)}
          />

          <InsightChipRow
            title="Possible Pain Points"
            items={profile.painPoints}
            emptyLabel="No pain points inferred for this profile."
          />

          <RecommendationCards products={profile.recommendedProducts} />

          <ConversationCards starters={profile.recommendedConversation} />

          <NextQuestionCard question={profile.recommendedNextQuestion} />

          <QuickNotes sessionId={profile.sessionId} />

          <CompanionActions
            profile={profile}
            conversationComplete={conversationComplete}
            onMarkedComplete={() => setConversationComplete(true)}
          />
        </Stack>
      </PageContainer>
    </div>
  );
}
