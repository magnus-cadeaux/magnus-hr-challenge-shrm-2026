"use client";

import { m } from "framer-motion";
import { Surface } from "@/components/layout/surface";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";

interface CollectionCodeProps {
  code: string;
  reduceMotion?: boolean;
}

export function CollectionCode({
  code,
  reduceMotion = false,
}: CollectionCodeProps) {
  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.slow, ease: easings.outExpo, delay: 0.1 }}
      className="w-full"
    >
      <Surface variant="glass-strong" padding="lg" radius="xl" className="w-full">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Stack gap="sm" align="center" className="sm:items-start">
            <Text variant="micro">Gift Collection Code</Text>
            <Text
              as="p"
              variant="display"
              className="text-[2.5rem] tracking-[0.12em] text-gradient-blue md:text-[3rem]"
            >
              {code}
            </Text>
            <Text variant="caption" className="max-w-sm text-pretty sm:text-left">
              Please show this code to a Magnus team member to collect your gift.
            </Text>
          </Stack>

          <QrPlaceholder label={code} />
        </div>
      </Surface>
    </m.div>
  );
}

function QrPlaceholder({ label }: { label: string }) {
  const cells = Array.from({ length: 81 }, (_, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const filled =
      ((row * 7 + col * 5 + label.length) % 3 !== 0) ||
      row === 0 ||
      col === 0 ||
      row === 8 ||
      col === 8;
    return filled;
  });

  return (
    <div
      className="flex size-28 shrink-0 flex-col items-center justify-center rounded-2xl border border-border/60 bg-navy-950/60 p-3"
      aria-hidden
    >
      <div className="grid size-full grid-cols-9 gap-0.5">
        {cells.map((filled, index) => (
          <span
            key={index}
            className={filled ? "rounded-[1px] bg-blue-200/80" : "bg-transparent"}
          />
        ))}
      </div>
      <Text variant="micro" className="mt-2 text-[9px] tracking-widest text-muted-foreground">
        QR
      </Text>
    </div>
  );
}
