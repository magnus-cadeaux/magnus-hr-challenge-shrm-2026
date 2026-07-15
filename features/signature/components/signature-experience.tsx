"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { GradientBackground } from "@/components/ui/gradient-background";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Stack } from "@/components/layout";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ROUTES } from "@/lib/constants";
import { readChallengeSession } from "@/features/challenge/engine/session-storage";
import {
  buildSignatureProfile,
  persistSignatureProfile,
  readSignatureProfile,
  type SignatureProfileResult,
} from "../engine";
import { SignatureCard } from "./signature-card";
import { LeadershipRadar } from "./leadership-radar";
import { StrengthBars } from "./strength-bars";
import {
  AchievementsBlock,
  ExecutiveInsight,
  PercentileBlock,
  RecommendationsBlock,
} from "./profile-sections";

export function SignatureExperience() {
  const router = useRouter();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [profile, setProfile] = useState<SignatureProfileResult | null>(null);

  useEffect(() => {
    const existing = readSignatureProfile();
    if (existing) {
      setProfile(existing);
      return;
    }

    const session = readChallengeSession();
    if (!session || session.status !== "completed") {
      router.replace(ROUTES.challenge);
      return;
    }

    const next = buildSignatureProfile(session);
    persistSignatureProfile(next);
    setProfile(next);
  }, [router]);

  if (!profile) {
    return <LoadingScreen label="Preparing your signature" />;
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <VisuallyHidden>
        <h1>Your Magnus HR Signature™</h1>
      </VisuallyHidden>
      <GradientBackground variant="hero" withOrb />
      <FloatingParticles density="sparse" tone="mixed" className="opacity-50" />

      <PageContainer className="relative z-10 py-10 md:py-14">
        <Stack gap="section" className="mx-auto w-full max-w-4xl pb-28">
          <SignatureCard profile={profile} reduceMotion={reduceMotion} />

          <LeadershipRadar
            scores={profile.normalizedScores}
            reduceMotion={reduceMotion}
          />

          <StrengthBars
            scores={profile.normalizedScores}
            reduceMotion={reduceMotion}
          />

          <PercentileBlock
            value={profile.percentile}
            reduceMotion={reduceMotion}
          />

          <ExecutiveInsight
            copy={profile.insight}
            reduceMotion={reduceMotion}
          />

          <RecommendationsBlock
            items={profile.recommendations}
            reduceMotion={reduceMotion}
          />

          <AchievementsBlock
            items={profile.achievements}
            reduceMotion={reduceMotion}
          />
        </Stack>
      </PageContainer>

      <div className="glass-panel safe-bottom fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-border/60 px-5 py-4 md:px-8">
        <div className="mx-auto flex w-full max-w-4xl justify-end">
          <Button
            size="lg"
            motionDisabled={reduceMotion}
            onClick={() => router.push(ROUTES.reward)}
          >
            Continue to Your Reward
          </Button>
        </div>
      </div>
    </div>
  );
}
