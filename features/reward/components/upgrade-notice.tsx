"use client";

import { AnimatePresence, m } from "framer-motion";
import { Surface } from "@/components/layout/surface";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";

interface UpgradeNoticeProps {
  visible: boolean;
  reduceMotion?: boolean;
}

export function UpgradeNotice({
  visible,
  reduceMotion = false,
}: UpgradeNoticeProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 10, filter: "blur(6px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.reveal, ease: easings.outExpo }}
        >
          <Surface
            variant="glass-border"
            padding="md"
            radius="lg"
            className="text-center shadow-glow-sm"
          >
            <Text variant="micro" className="text-achievement">
              Premium Upgrade
            </Text>
            <Text variant="heading" className="mt-2 text-gradient-gold">
              You&apos;ve unlocked a Premium Upgrade.
            </Text>
          </Surface>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
