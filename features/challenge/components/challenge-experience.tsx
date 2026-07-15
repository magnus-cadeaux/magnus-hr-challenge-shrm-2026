"use client";

import { AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/ui/page-container";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useChallengeSession } from "../hooks/use-challenge-session";
import { useElapsedTime } from "../hooks/use-elapsed-time";
import { QuestionScreen } from "./question-screen";
import { InsightScreen } from "./insight-screen";

export function ChallengeExperience() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { session, currentQuestion, submitAnswer, continueAfterInsight, isReady } =
    useChallengeSession();
  const { label: elapsedLabel } = useElapsedTime(
    session?.startedAt,
    session?.status === "in_progress",
  );

  if (!isReady || !session) {
    return <LoadingScreen label="Preparing your decisions" />;
  }

  if (session.phase === "complete") {
    return <LoadingScreen label="Preparing your analysis" />;
  }

  return (
    <PageContainer className="flex flex-col justify-center py-8 md:py-12">
      <VisuallyHidden>
        <h1>Magnus HR Challenge · Decisions</h1>
      </VisuallyHidden>

      <AnimatePresence mode="wait">
        {session.phase === "question" && currentQuestion ? (
          <QuestionScreen
            key={`question-${currentQuestion.id}`}
            question={currentQuestion}
            index={session.currentIndex}
            total={session.questions.length}
            elapsedLabel={elapsedLabel}
            onAnswer={submitAnswer}
            reduceMotion={reduceMotion}
          />
        ) : null}

        {session.phase === "insight" && session.lastInsight ? (
          <InsightScreen
            key={`insight-${session.currentIndex}`}
            insight={session.lastInsight}
            onContinue={continueAfterInsight}
            reduceMotion={reduceMotion}
          />
        ) : null}
      </AnimatePresence>
    </PageContainer>
  );
}
