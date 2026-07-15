"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Text } from "@/components/typography";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ROUTES } from "@/lib/constants";
import { durations, easings } from "@/lib/design-system/motion";
import {
  computeChallengeScore,
  readChallengeSession,
} from "@/features/challenge/engine";
import { persistLeaderboardEntry } from "@/features/leaderboard/engine/entry-storage";
import { readParticipantDraft } from "@/features/sales/engine/compose-from-local";
import { buildSignatureProfile, persistSignatureProfile } from "@/features/signature/engine";
import { runSalesIntelligenceEngine } from "@/features/sales/engine";
import { ANALYSIS_SEQUENCE } from "@/features/signature/config";
import { NeuralNetwork } from "./neural-network";

export function AnalysisSequence() {
  const router = useRouter();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(false);

  const totalMs = reduceMotion
    ? ANALYSIS_SEQUENCE.reducedMotionMs
    : ANALYSIS_SEQUENCE.totalMs;

  useEffect(() => {
    const session = readChallengeSession();
    if (!session || session.status !== "completed") {
      router.replace(ROUTES.challenge);
      return;
    }

    const draft = readParticipantDraft();
    const profile = buildSignatureProfile(session, {
      displayName: draft?.fullName,
      organization: draft?.organization,
    });
    persistSignatureProfile(profile);

    const elapsedMs = session.completedAt
      ? new Date(session.completedAt).getTime() -
        new Date(session.startedAt).getTime()
      : 0;
    const score =
      session.score ??
      computeChallengeScore(session.dimensionScores, elapsedMs);

    persistLeaderboardEntry({
      localSessionId: session.sessionId,
      displayName:
        draft?.fullName?.trim() || profile.displayName,
      companyName:
        draft?.organization?.trim() || profile.organization,
      score,
      signatureId: profile.primary.id,
      signatureName: profile.primary.name,
    });

    runSalesIntelligenceEngine({ challenge: session, signature: profile });
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;

    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(now - started, totalMs);
      setElapsed(next);
      if (next < totalMs) {
        frame = window.requestAnimationFrame(tick);
      } else {
        router.push(ROUTES.signature);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [ready, totalMs, router]);

  const progress = (elapsed / totalMs) * 100;

  const message = useMemo(() => {
    const messages = ANALYSIS_SEQUENCE.messages;
    if (reduceMotion) return messages[messages.length - 1].text as string;
    let current: string = messages[0].text;
    for (const item of messages) {
      if (elapsed >= item.atMs) current = item.text;
    }
    return current;
  }, [elapsed, reduceMotion]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy-950">
      <VisuallyHidden>
        <h1>Analysing your Magnus HR Signature™</h1>
      </VisuallyHidden>

      <GradientBackground variant="minimal" withOrb={false} />
      <div className="pointer-events-none absolute inset-0 bg-navy-950/70" />
      <FloatingParticles density="sparse" tone="blue" className="opacity-40" />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-16">
        <NeuralNetwork progress={progress} reduceMotion={reduceMotion} />

        <div className="mt-10 h-16 w-full max-w-lg text-center">
          <AnimatePresence mode="wait">
            <m.div
              key={message}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{
                duration: reduceMotion ? durations.fast : durations.slow,
                ease: easings.outExpo,
              }}
            >
              <Text variant="subtitle" align="center" className="text-balance">
                {message}
              </Text>
            </m.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-2" aria-hidden>
          {[0, 1, 2].map((dot) => (
            <m.span
              key={dot}
              className="size-1.5 rounded-full bg-blue-400/80"
              animate={
                reduceMotion
                  ? { opacity: 0.7 }
                  : { opacity: [0.25, 1, 0.25], scale: [1, 1.25, 1] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 1.6,
                      repeat: Infinity,
                      delay: dot * 0.2,
                      ease: "easeInOut",
                    }
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
