"use client";

import { OptionButton } from "./option-button";
import { Stack } from "@/components/layout";
import type { ChallengeOptionConfig } from "../../engine/types";

interface MultipleChoiceAnswerProps {
  options: ChallengeOptionConfig[];
  onSelect: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}

export function MultipleChoiceAnswer({
  options,
  onSelect,
  disabled,
  reduceMotion,
}: MultipleChoiceAnswerProps) {
  return (
    <Stack gap="sm" className="w-full">
      {options.map((option) => (
        <OptionButton
          key={option.id}
          option={option}
          disabled={disabled}
          reduceMotion={reduceMotion}
          onSelect={(id) => onSelect([id])}
        />
      ))}
    </Stack>
  );
}
