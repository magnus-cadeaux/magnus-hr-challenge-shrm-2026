"use client";

import { m } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Flex, Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import {
  CHALLENGE_CATEGORY_LABELS,
  QUESTIONS_PER_SESSION,
  type PreparedChallengeQuestion,
} from "../engine";
import { AnswerRenderer } from "./answers/answer-renderer";

interface QuestionScreenProps {
  question: PreparedChallengeQuestion;
  index: number;
  total?: number;
  elapsedLabel: string;
  onAnswer: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}

export function QuestionScreen({
  question,
  index,
  total = QUESTIONS_PER_SESSION,
  elapsedLabel,
  onAnswer,
  disabled = false,
  reduceMotion = false,
}: QuestionScreenProps) {
  const progress = ((index + 1) / total) * 100;

  return (
    <m.div
      key={question.id}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 20, scale: 0.985 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -12, scale: 0.99 }
      }
      transition={{
        duration: reduceMotion ? durations.fast : durations.slow,
        ease: easings.outExpo,
      }}
      style={{ willChange: "transform, opacity" }}
      className="mx-auto flex w-full max-w-3xl flex-col gap-8"
    >
      <Stack gap="md" className="w-full">
        <Flex justify="between" align="center" wrap className="gap-3">
          <Badge variant="secondary">
            {CHALLENGE_CATEGORY_LABELS[question.category]}
          </Badge>
          <Text variant="caption" className="tabular-nums text-blue-300">
            {elapsedLabel}
          </Text>
        </Flex>

        <Text variant="title" className="max-w-3xl text-balance">
          {question.prompt}
        </Text>
      </Stack>

      <GlassCard intensity="strong" padding="lg" className="w-full">
        <AnswerRenderer
          question={question}
          onSelect={onAnswer}
          disabled={disabled}
          reduceMotion={reduceMotion}
        />
      </GlassCard>

      <Stack gap="sm" className="w-full">
        <Flex justify="between" align="center">
          <Text variant="caption">
            Decision {index + 1} of {total}
          </Text>
          <Text variant="caption" className="tabular-nums">
            {Math.round(progress)}%
          </Text>
        </Flex>
        <Progress value={progress} />
      </Stack>
    </m.div>
  );
}
