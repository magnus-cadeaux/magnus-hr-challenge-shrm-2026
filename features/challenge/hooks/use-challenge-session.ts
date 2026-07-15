"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import {
  advanceAfterInsight,
  applyAnswerToSession,
  collectAnswer,
  createChallengeSession,
  getCurrentQuestion,
  type ChallengeSessionState,
} from "../engine";
import { persistChallengeSession } from "../engine/session-storage";

export function useChallengeSession() {
  const router = useRouter();
  const [session, setSession] = useState<ChallengeSessionState | null>(null);

  useEffect(() => {
    setSession(createChallengeSession());
  }, []);

  useEffect(() => {
    if (!session) return;
    persistChallengeSession(session);
  }, [session]);

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

  const continueAfterInsight = useCallback(() => {
    setSession((current) => {
      if (!current || current.phase !== "insight") return current;
      const next = advanceAfterInsight(current);
      if (next.phase === "complete") {
        persistChallengeSession(next);
        router.push(ROUTES.analysis);
      }
      return next;
    });
  }, [router]);

  return {
    session,
    currentQuestion,
    submitAnswer,
    continueAfterInsight,
    isReady: Boolean(session),
  } as const;
}
