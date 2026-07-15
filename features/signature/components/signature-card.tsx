"use client";

import { m } from "framer-motion";
import { Surface } from "@/components/layout/surface";
import { Stack } from "@/components/layout";
import { Eyebrow, Text } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { durations, easings } from "@/lib/design-system/motion";
import type { SignatureProfileResult } from "../engine/types";

interface SignatureCardProps {
  profile: SignatureProfileResult;
  reduceMotion?: boolean;
}

export function SignatureCard({
  profile,
  reduceMotion = false,
}: SignatureCardProps) {
  const pieces = [
    { key: "brand", delay: 0.05 },
    { key: "identity", delay: 0.18 },
    { key: "primary", delay: 0.32 },
    { key: "secondary", delay: 0.46 },
  ] as const;

  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: durations.reveal, ease: easings.outExpo }}
      className="relative"
    >
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-3xl" />
      <Surface
        variant="glass-panel"
        padding="lg"
        radius="xl"
        className="relative overflow-hidden shadow-glow"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        <Stack gap="lg">
          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : pieces[0].delay,
              duration: durations.slow,
              ease: easings.outExpo,
            }}
          >
            <Eyebrow>Magnus</Eyebrow>
            <Text variant="title" gradient="blue" className="mt-2 tracking-tight">
              HR Signature™
            </Text>
          </m.div>

          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : pieces[1].delay,
              duration: durations.slow,
              ease: easings.outExpo,
            }}
          >
            <Text variant="heading">{profile.displayName}</Text>
            <Text variant="caption" className="mt-1">
              {profile.organization}
            </Text>
          </m.div>

          <Separator tone="glow" />

          <m.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : pieces[2].delay,
              duration: durations.slow,
              ease: easings.outExpo,
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div>
              <Text variant="micro">Primary Signature</Text>
              <Text variant="heading" className="mt-1 text-gradient-blue">
                {profile.primary.name}
              </Text>
            </div>
            <div>
              <Text variant="micro">Secondary Signature</Text>
              <Text variant="heading" className="mt-1">
                {profile.secondary.name}
              </Text>
            </div>
          </m.div>
        </Stack>
      </Surface>
    </m.div>
  );
}
