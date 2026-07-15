"use client";

import { AnimatePresence, m } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Cluster, Flex } from "@/components/layout";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/design-system/motion";
import type { IdleInsightCard } from "../mock-idle-stats";

interface RotatingInsightCardsProps {
  card: IdleInsightCard;
  index: number;
  total: number;
  paused?: boolean;
  reduceMotion?: boolean;
}

export function RotatingInsightCards({
  card,
  index,
  total,
  paused = false,
  reduceMotion = false,
}: RotatingInsightCardsProps) {
  const Icon = card.icon;
  const isSignature = card.id === "signature";

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative min-h-[11.5rem]">
        <AnimatePresence mode="wait">
          <m.div
            key={card.id}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 18, filter: "blur(6px)" }
            }
            animate={
              paused
                ? { opacity: 0.55, y: 0, filter: "blur(0px)" }
                : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -14, filter: "blur(4px)" }
            }
            transition={{
              duration: reduceMotion ? durations.fast : durations.slow,
              ease: easings.outExpo,
            }}
            style={{ willChange: "transform, opacity, filter" }}
            className="absolute inset-x-0"
          >
            <GlassCard intensity="strong" padding="lg" className="w-full">
              <Flex justify="between" align="start" className="mb-5">
                <Text variant="eyebrow" className="text-muted-foreground">
                  {card.label}
                </Text>
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl",
                    card.achievement
                      ? "bg-achievement/15 text-achievement"
                      : "bg-primary/15 text-blue-300",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
              </Flex>

              {isSignature ? (
                <Text
                  variant="title"
                  gradient={card.achievement ? "gold" : "blue"}
                  className="text-[1.75rem] md:text-[2rem]"
                >
                  {card.description}
                </Text>
              ) : (
                <>
                  <AnimatedCounter
                    key={`${card.id}-${index}`}
                    value={card.value}
                    prefix={card.prefix}
                    suffix={card.suffix}
                    decimals={card.decimals}
                    className={cn(
                      "text-4xl font-extrabold tracking-tight md:text-5xl",
                      card.achievement
                        ? "text-gradient-gold"
                        : "text-foreground",
                    )}
                  />
                  <Text variant="body-sm" className="mt-3">
                    {card.description}
                  </Text>
                </>
              )}
            </GlassCard>
          </m.div>
        </AnimatePresence>
      </div>

      <Cluster gap="sm" align="center" className="mt-5 justify-center">
        {Array.from({ length: total }, (_, dotIndex) => (
          <span
            key={dotIndex}
            className={cn(
              "size-1.5 rounded-full transition-colors duration-300",
              dotIndex === index ? "bg-blue-400 shadow-glow-sm" : "bg-white/20",
            )}
            aria-hidden
          />
        ))}
      </Cluster>
    </div>
  );
}
