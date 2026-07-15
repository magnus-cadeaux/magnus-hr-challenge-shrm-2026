"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { Text } from "@/components/typography";
import type { ChallengeOptionConfig } from "../../engine/types";

interface OptionButtonProps {
  option: ChallengeOptionConfig;
  selected?: boolean;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  rank?: number;
  reduceMotion?: boolean;
}

export function OptionButton({
  option,
  selected = false,
  onSelect,
  disabled = false,
  rank,
  reduceMotion = false,
}: OptionButtonProps) {
  return (
    <m.button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.985 }}
      className={cn(
        "glass min-h-14 w-full rounded-2xl px-5 py-4 text-left transition-[border-color,background,box-shadow] duration-200",
        "hover:border-blue-400/35 hover:bg-white/5",
        selected && "border-blue-400/50 bg-primary/15 shadow-glow-sm",
        disabled && "opacity-60",
      )}
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center gap-3">
        {rank != null ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-blue-200">
            {rank}
          </span>
        ) : null}
        <Text as="span" variant="body" className="font-medium text-foreground">
          {option.label}
        </Text>
      </div>
    </m.button>
  );
}
