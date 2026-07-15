"use client";

import { AnimatePresence, m } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Flex, Stack } from "@/components/layout";
import { Eyebrow, Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/design-system/motion";
import type { RegistrationStepDefinition } from "../constants";

interface StepFrameProps {
  step: RegistrationStepDefinition;
  direction: 1 | -1;
  reduceMotion?: boolean;
  isFirst: boolean;
  primaryLabel: string;
  onBack: () => void;
  onNext: () => void;
  children: ReactNode;
  hidePrimary?: boolean;
}

export function StepFrame({
  step,
  direction,
  reduceMotion = false,
  isFirst,
  primaryLabel,
  onBack,
  onNext,
  children,
  hidePrimary = false,
}: StepFrameProps) {
  const Icon = step.icon;
  const distance = reduceMotion ? 0 : 28;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <Flex justify="between" align="center" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isFirst}
          motionDisabled={reduceMotion || isFirst}
          aria-label="Go back"
        >
          <ArrowLeft />
          Back
        </Button>

        <Flex gap="md" align="center">
          <div className="text-right">
            <Eyebrow>Question {step.number} of 5</Eyebrow>
            <Text variant="caption" className="mt-1 tabular-nums text-blue-300">
              {step.progress}%
            </Text>
          </div>
          <ProgressRing
            value={step.progress}
            size={52}
            strokeWidth={5}
            showValue={false}
            label={`Registration progress ${step.progress} percent`}
            className="shrink-0"
          />
        </Flex>
      </Flex>

      <div className="relative min-h-[28rem]">
        <AnimatePresence mode="wait" custom={direction}>
          <m.div
            key={step.id}
            custom={direction}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: direction * distance,
                    scale: 0.98,
                  }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: direction * -distance,
                    scale: 0.98,
                  }
            }
            transition={{
              duration: reduceMotion ? durations.fast : durations.slow,
              ease: easings.outExpo,
            }}
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-x-0"
          >
            <GlassCard intensity="strong" padding="lg" className="w-full">
              <Stack gap="xl" align="stretch">
                <Stack gap="md" align="start">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-blue-300">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <Text variant="title" className="text-balance">
                    {step.title}
                  </Text>
                </Stack>

                {children}

                {!hidePrimary ? (
                  <Button
                    size="lg"
                    className={cn("w-full sm:w-auto sm:self-end")}
                    onClick={onNext}
                    motionDisabled={reduceMotion}
                  >
                    {primaryLabel}
                    <ArrowRight />
                  </Button>
                ) : null}
              </Stack>
            </GlassCard>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
