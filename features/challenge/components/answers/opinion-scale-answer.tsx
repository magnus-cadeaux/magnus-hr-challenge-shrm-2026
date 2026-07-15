"use client";

import { Stack } from "@/components/layout";
import { OptionButton } from "./option-button";
import type { ChallengeOptionConfig } from "../../engine/types";

interface OpinionScaleAnswerProps {
  options: ChallengeOptionConfig[];
  onSelect: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}

export function OpinionScaleAnswer({
  options,
  onSelect,
  disabled,
  reduceMotion,
}: OpinionScaleAnswerProps) {
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
