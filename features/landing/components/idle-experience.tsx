"use client";

import { m } from "framer-motion";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { BrandMark } from "@/components/ui/brand-mark";
import { EVENT_NAME } from "@/lib/constants";
import { durations, easings } from "@/lib/design-system/motion";
import { cn } from "@/lib/utils";
import { RotatingInsightCards } from "./rotating-insight-cards";
import { useRotatingInsightIndex } from "../hooks/use-rotating-insight";
import type { IdleInsightCard } from "../mock-idle-stats";

interface IdleExperienceProps {
  frozen?: boolean;
  reduceMotion?: boolean;
  onBegin: () => void;
}

export function IdleExperience({
  frozen = false,
  reduceMotion = false,
  onBegin,
}: IdleExperienceProps) {
  const { index, card, total } = useRotatingInsightIndex(!frozen);

  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-label="Tap anywhere to begin the Magnus HR Challenge"
      onClick={frozen ? undefined : onBegin}
      onKeyDown={
        frozen
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onBegin();
              }
            }
      }
      className={cn(
        "relative z-10 flex min-h-dvh w-full flex-col outline-none",
        frozen ? "pointer-events-none cursor-default" : "cursor-pointer",
      )}
      animate={frozen ? { opacity: 0.92 } : { opacity: 1 }}
      transition={{ duration: durations.reveal, ease: easings.outExpo }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 md:px-10">
        <Stack gap="xl" align="center" className="w-full max-w-3xl text-center">
          <m.div
            animate={
              reduceMotion
                ? { scale: frozen ? 1.08 : 1 }
                : frozen
                  ? { scale: 1.12 }
                  : { scale: [1, 1.03, 1] }
            }
            transition={
              frozen
                ? { duration: durations.reveal, ease: easings.outExpo }
                : reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
            }
            style={{ willChange: "transform" }}
          >
            <BrandMark size="hero" priority className="mx-auto object-center" />
          </m.div>

          <Text variant="eyebrow" align="center">
            {EVENT_NAME}
          </Text>

          <Text
            variant="subtitle"
            align="center"
            className="max-w-xl text-balance"
          >
            Every Great Employee Experience
            <br />
            Starts With One Decision.
          </Text>

          <RotatingInsightCards
            card={card as IdleInsightCard}
            index={index}
            total={total}
            paused={frozen}
            reduceMotion={reduceMotion}
          />

          <m.div
            animate={
              frozen || reduceMotion
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: [0.72, 1, 0.72],
                    scale: [1, 1.03, 1],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{ willChange: "transform, opacity" }}
            className="glass rounded-full px-8 py-3 shadow-glow"
          >
            <Text
              as="span"
              variant="micro"
              className="tracking-[0.18em] text-blue-200"
            >
              Tap Anywhere to Begin
            </Text>
          </m.div>
        </Stack>
      </div>

      <footer className="safe-bottom relative z-10 px-6 pb-6 text-center">
        <Text variant="caption" className="text-muted-foreground/80">
          Crafted by Magnus
        </Text>
        <Text variant="micro" className="mt-1 text-muted-foreground/60">
          Employee Experience Specialists
        </Text>
      </footer>
    </m.div>
  );
}
