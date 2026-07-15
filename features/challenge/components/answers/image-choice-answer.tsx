"use client";

import { m } from "framer-motion";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { ChallengeOptionConfig } from "../../engine/types";

interface ImageChoiceAnswerProps {
  options: ChallengeOptionConfig[];
  onSelect: (optionIds: string[]) => void;
  disabled?: boolean;
  reduceMotion?: boolean;
}

export function ImageChoiceAnswer({
  options,
  onSelect,
  disabled,
  reduceMotion,
}: ImageChoiceAnswerProps) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <m.button
          key={option.id}
          type="button"
          disabled={disabled}
          whileTap={reduceMotion || disabled ? undefined : { scale: 0.98 }}
          onClick={() => onSelect([option.id])}
          className={cn(
            "glass overflow-hidden rounded-2xl text-left transition-[border-color,box-shadow] duration-200",
            "hover:border-blue-400/35 hover:shadow-glow-sm",
            disabled && "opacity-60",
          )}
          style={{ willChange: "transform" }}
        >
          <div className="aspect-[16/10] w-full bg-navy-850">
            {option.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={option.imageSrc}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-blue-soft">
                <Text variant="caption">Image placeholder</Text>
              </div>
            )}
          </div>
          <Stack gap="none" className="px-4 py-3">
            <Text as="span" variant="body" className="font-medium">
              {option.label}
            </Text>
          </Stack>
        </m.button>
      ))}
    </div>
  );
}
