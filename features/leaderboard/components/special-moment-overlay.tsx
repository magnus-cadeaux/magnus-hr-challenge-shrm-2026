"use client";

import { AnimatePresence, m } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import type { SpecialMoment } from "../engine/types";

interface SpecialMomentOverlayProps {
  moment: SpecialMoment | null;
  reduceMotion?: boolean;
}

export function SpecialMomentOverlay({
  moment,
  reduceMotion = false,
}: SpecialMomentOverlayProps) {
  return (
    <AnimatePresence>
      {moment ? (
        <m.div
          key={moment.id}
          className="pointer-events-none fixed inset-x-0 top-[12%] z-50 flex justify-center px-4"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -16, scale: 0.97 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -10, scale: 0.98 }
          }
          transition={{
            duration: reduceMotion ? durations.fast : durations.slow,
            ease: easings.outExpo,
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <GlassCard
            intensity="strong"
            gradientBorder
            padding="lg"
            className="max-w-2xl text-center shadow-[0_20px_80px_-20px_rgba(15,23,42,0.9)]"
          >
            <Text variant="eyebrow" className="mb-3 text-achievement">
              Special moment
            </Text>
            <Text
              variant="heading"
              className="text-2xl text-balance md:text-3xl"
            >
              {moment.message}
            </Text>
          </GlassCard>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
