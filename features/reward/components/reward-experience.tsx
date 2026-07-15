"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { GradientBackground } from "@/components/ui/gradient-background";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { PageContainer } from "@/components/ui/page-container";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ROUTES } from "@/lib/constants";
import { readChallengeSession } from "@/features/challenge/engine/session-storage";
import { readSignatureProfile } from "@/features/signature/engine";
import {
  assignReward,
  persistRewardAssignment,
  readRewardAssignment,
  type RewardAssignment,
} from "../engine";
import { GiftReveal } from "./gift-reveal";
import { CollectionCode } from "./collection-code";
import { UpgradeNotice } from "./upgrade-notice";

export function RewardExperience() {
  const router = useRouter();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [assignment, setAssignment] = useState<RewardAssignment | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const existing = readRewardAssignment();
    if (existing) {
      setAssignment(existing);
      return;
    }

    const challenge = readChallengeSession();
    const signature = readSignatureProfile();
    const sessionId =
      challenge?.sessionId || signature?.sessionId || `guest_${Date.now()}`;

    const result = assignReward(sessionId);
    if (!result) {
      router.replace(ROUTES.signature);
      return;
    }

    persistRewardAssignment(result.assignment);
    setAssignment(result.assignment);
  }, [router]);

  useEffect(() => {
    if (!assignment?.upgraded || !revealed) return;
    setShowUpgrade(true);
  }, [assignment, revealed]);

  if (!assignment) {
    return <LoadingScreen label="Preparing your gift" />;
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <VisuallyHidden>
        <h1>Your Magnus Reward</h1>
      </VisuallyHidden>

      <GradientBackground variant="hero" withOrb />
      <div className="pointer-events-none absolute inset-0 bg-navy-950/35" />
      <FloatingParticles density="sparse" tone="mixed" className="opacity-45" />

      <PageContainer className="relative z-10 py-10 md:py-14">
        <Stack gap="xl" className="mx-auto w-full max-w-2xl pb-28" align="center">
          <Stack gap="sm" align="center" className="text-center">
            <Text variant="display" gradient="blue" className="tracking-tight">
              Thank You.
            </Text>
            <Text variant="subtitle" align="center" className="max-w-lg">
              We&apos;ve reserved a premium gift for you.
            </Text>
          </Stack>

          <UpgradeNotice visible={showUpgrade} reduceMotion={reduceMotion} />

          <GiftReveal
            gift={assignment.gift}
            reduceMotion={reduceMotion}
            onRevealed={() => setRevealed(true)}
          />

          {revealed ? (
            <CollectionCode
              code={assignment.collectionCode}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </Stack>
      </PageContainer>

      <div className="glass-panel safe-bottom fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-border/60 px-5 py-4 md:px-8">
        <div className="mx-auto flex w-full max-w-2xl justify-end">
          <Button
            size="lg"
            motionDisabled={reduceMotion}
            onClick={() => router.push(ROUTES.leaderboard)}
          >
            View Today&apos;s Leaders
          </Button>
        </div>
      </div>
    </div>
  );
}
