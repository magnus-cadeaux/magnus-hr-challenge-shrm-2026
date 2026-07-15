"use client";

import { m } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Stack, Flex } from "@/components/layout";
import { Text } from "@/components/typography";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { durations, easings } from "@/lib/design-system/motion";
import type {
  AchievementDefinition,
  RecommendationDefinition,
} from "../engine/types";

interface PercentileBlockProps {
  value: number;
  reduceMotion?: boolean;
}

export function PercentileBlock({
  value,
  reduceMotion = false,
}: PercentileBlockProps) {
  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.slow, ease: easings.outExpo }}
    >
      <GlassCard intensity="subtle" padding="lg" className="text-center">
        <Text variant="micro">Top Percentile</Text>
        <Text variant="display" gradient="blue" className="mt-2 text-[2.5rem]">
          Top <AnimatedCounter value={value} className="inline" />%
        </Text>
        <Text variant="caption" className="mt-2">
          Today&apos;s HR Leaders
        </Text>
      </GlassCard>
    </m.div>
  );
}

interface ExecutiveInsightProps {
  copy: string;
  reduceMotion?: boolean;
}

export function ExecutiveInsight({
  copy,
  reduceMotion = false,
}: ExecutiveInsightProps) {
  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.slow, ease: easings.outExpo }}
    >
      <Stack gap="sm">
        <Text variant="heading">Executive Insight</Text>
        <Text variant="lead" className="max-w-3xl text-pretty">
          {copy}
        </Text>
      </Stack>
    </m.div>
  );
}

interface RecommendationsBlockProps {
  items: RecommendationDefinition[];
  reduceMotion?: boolean;
}

export function RecommendationsBlock({
  items,
  reduceMotion = false,
}: RecommendationsBlockProps) {
  return (
    <Stack gap="md">
      <Text variant="heading">Magnus Recommendations</Text>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <m.div
            key={item.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: durations.slow,
              ease: easings.outExpo,
              delay: reduceMotion ? 0 : index * 0.08,
            }}
          >
            <GlassCard intensity="default" padding="md" className="h-full">
              <Text variant="micro">Recommended</Text>
              <Text variant="heading" className="mt-2 text-base">
                {item.title}
              </Text>
            </GlassCard>
          </m.div>
        ))}
      </div>
    </Stack>
  );
}

interface AchievementsBlockProps {
  items: AchievementDefinition[];
  reduceMotion?: boolean;
}

export function AchievementsBlock({
  items,
  reduceMotion = false,
}: AchievementsBlockProps) {
  return (
    <Stack gap="md">
      <Text variant="heading">Achievements</Text>
      <Flex gap="md" wrap className="w-full">
        {items.map((item, index) => (
          <m.div
            key={item.id}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 24, filter: "blur(6px)" }
            }
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              duration: durations.slow,
              ease: easings.outExpo,
              delay: reduceMotion ? 0 : index * 0.1,
            }}
            className="min-w-[14rem] flex-1"
          >
            <GlassCard intensity="strong" padding="md" className="h-full">
              <Text variant="heading" className="text-base text-gradient-blue">
                {item.title}
              </Text>
              <Text variant="caption" className="mt-2 text-pretty">
                {item.description}
              </Text>
            </GlassCard>
          </m.div>
        ))}
      </Flex>
    </Stack>
  );
}
