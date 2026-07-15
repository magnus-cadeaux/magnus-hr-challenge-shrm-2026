"use client";

import { MultipleChoiceAnswer } from "./multiple-choice-answer";
import type { ChallengeOptionConfig } from "../../engine/types";

interface TrueFalseAnswerProps {
  options: ChallengeOptionConfig[];
  onSelect: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}

export function TrueFalseAnswer(props: TrueFalseAnswerProps) {
  return <MultipleChoiceAnswer {...props} />;
}
