"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import {
  advanceAfterInsight,
  applyAnswerToSession,
  collectAnswer,
  createChallengeSession,
  getCurrentQuestion,
  INSIGHT_DISPLAY_MS,
  type ChallengeSessionState,
} from "../engine";
import { persistChallengeSession } from "../engine/session-storage";

export function useChallengeSession() {
  const router = useRouter();
  const [session, setSession] = useState<ChallengeSessionState | null>(null);
  const insightTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setSession(createChallengeSession());
  }, []);

  useEffect(() => {
    if (!session) return;
    persistChallengeSession(session);
  }, [session]);

  useEffect(() => {
    return () => {
      if (insightTimerRef.current != null) {
        window.clearTimeout(insightTimerRef.current);
      }
    };
  }, []);

  const currentQuestion = useMemo(
    () => (session ? getCurrentQuestion(session) : null),
    [session],
  );

  const submitAnswer = useCallback((optionIds: string[]) => {
    setSession((current) => {
      if (!current || current.phase !== "question") return current;
      const question = getCurrentQuestion(current);
      if (!question || optionIds.length === 0) return current;

      const answer = collectAnswer(question, optionIds);
      return applyAnswerToSession(current, answer);
    });
  }, []);

  useEffect(() => {
    if (!session || session.phase !== "insight") return;

    insightTimerRef.current = window.setTimeout(() => {
      setSession((current) => {
        if (!current || current.phase !== "insight") return current;
        const next = advanceAfterInsight(current);
        if (next.phase === "complete") {
          persistChallengeSession(next);
          router.push(ROUTES.analysis);
        }
        return next;
      });
    }, INSIGHT_DISPLAY_MS);

    return () => {
      if (insightTimerRef.current != null) {
        window.clearTimeout(insightTimerRef.current);
      }
    };
  }, [session, router]);

  return {
    session,
    currentQuestion,
    submitAnswer,
    isReady: Boolean(session),
  } as const;
}
