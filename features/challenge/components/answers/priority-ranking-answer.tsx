"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { OptionButton } from "./option-button";
import type { ChallengeOptionConfig } from "../../engine/types";

interface PriorityRankingAnswerProps {
  options: ChallengeOptionConfig[];
  onSelect: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}

/**
 * Simple sequential-tap ranking UI.
 * Drag-and-drop architecture can replace this without changing the engine.
 */
export function PriorityRankingAnswer({
  options,
  onSelect,
  disabled,
  reduceMotion,
}: PriorityRankingAnswerProps) {
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const remaining = useMemo(
    () => options.filter((option) => !orderedIds.includes(option.id)),
    [options, orderedIds],
  );

  const ranked = useMemo(
    () =>
      orderedIds
        .map((id) => options.find((option) => option.id === id))
        .filter(Boolean) as ChallengeOptionConfig[],
    [orderedIds, options],
  );

  return (
    <Stack gap="md" className="w-full">
      <Text variant="caption">
        Tap items in priority order. Drag ranking can be added later without
        changing the engine.
      </Text>

      {ranked.length > 0 ? (
        <Stack gap="sm">
          {ranked.map((option, index) => (
            <OptionButton
              key={option.id}
              option={option}
              rank={index + 1}
              selected
              disabled={disabled}
              reduceMotion={reduceMotion}
              onSelect={(id) =>
                setOrderedIds((current) => current.filter((item) => item !== id))
              }
            />
          ))}
        </Stack>
      ) : null}

      {remaining.length > 0 ? (
        <Stack gap="sm">
          {remaining.map((option) => (
            <OptionButton
              key={option.id}
              option={option}
              disabled={disabled}
              reduceMotion={reduceMotion}
              onSelect={(id) => setOrderedIds((current) => [...current, id])}
            />
          ))}
        </Stack>
      ) : null}

      <Button
        size="lg"
        disabled={disabled || orderedIds.length !== options.length}
        motionDisabled={reduceMotion}
        onClick={() => onSelect(orderedIds)}
        className="w-full sm:w-auto sm:self-end"
      >
        Confirm ranking
      </Button>
    </Stack>
  );
}
