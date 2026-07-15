"use client";

import { m } from "framer-motion";
import { Surface } from "@/components/layout/surface";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import type { InventoryGift } from "../engine/types";

interface GiftCardProps {
  gift: InventoryGift;
  reduceMotion?: boolean;
}

export function GiftCard({ gift, reduceMotion = false }: GiftCardProps) {
  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: durations.slow, ease: easings.outExpo }}
    >
      <Surface
        variant="glass-panel"
        padding="none"
        radius="xl"
        className="overflow-hidden shadow-glow"
      >
        <div className="aspect-[16/10] w-full bg-navy-850">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gift.imageSrc}
            alt=""
            className="size-full object-cover"
          />
        </div>
        <Stack gap="sm" className="p-6 md:p-8">
          <Text variant="micro">Your gift</Text>
          <Text variant="title" className="tracking-tight">
            {gift.name}
          </Text>
          <Text variant="lead" className="text-pretty">
            {gift.description}
          </Text>
        </Stack>
      </Surface>
    </m.div>
  );
}
