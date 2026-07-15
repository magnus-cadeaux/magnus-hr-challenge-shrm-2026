"use client";

import type { ComponentType } from "react";
import type {
  ChallengeOptionConfig,
  PreparedChallengeQuestion,
  QuestionType,
} from "../../engine/types";
import { MultipleChoiceAnswer } from "./multiple-choice-answer";
import { TrueFalseAnswer } from "./true-false-answer";
import { OpinionScaleAnswer } from "./opinion-scale-answer";
import { ImageChoiceAnswer } from "./image-choice-answer";
import { PriorityRankingAnswer } from "./priority-ranking-answer";

export type AnswerRendererProps = {
  options: ChallengeOptionConfig[];
  onSelect: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
};

const ANSWER_RENDERERS: Record<
  QuestionType,
  ComponentType<AnswerRendererProps>
> = {
  multiple_choice: MultipleChoiceAnswer,
  true_false: TrueFalseAnswer,
  opinion: MultipleChoiceAnswer,
  opinion_scale: OpinionScaleAnswer,
  image_choice: ImageChoiceAnswer,
  priority_ranking: PriorityRankingAnswer,
};

/**
 * Registry-based renderer. Add a new question type by registering here —
 * existing screens and engine contracts do not need rewrites.
 */
export function AnswerRenderer({
  question,
  onSelect,
  disabled,
  reduceMotion,
}: {
  question: PreparedChallengeQuestion;
  onSelect: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}) {
  const Renderer = ANSWER_RENDERERS[question.type];

  return (
    <Renderer
      options={question.options}
      onSelect={onSelect}
      disabled={disabled}
      reduceMotion={reduceMotion}
    />
  );
}

export function registerAnswerRenderer(
  type: QuestionType,
  component: ComponentType<AnswerRendererProps>,
) {
  ANSWER_RENDERERS[type] = component;
}
