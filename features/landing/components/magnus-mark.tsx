"use client";

import { m } from "framer-motion";
import { Surface } from "@/components/layout/surface";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/design-system/motion";

interface MagnusMarkProps {
  className?: string;
  expanded?: boolean;
  breathing?: boolean;
  reduceMotion?: boolean;
}

export function MagnusMark({
  className,
  expanded = false,
  breathing = true,
  reduceMotion = false,
}: MagnusMarkProps) {
  return (
    <m.div
      className={cn("relative flex items-center justify-center", className)}
      animate={
        reduceMotion
          ? { scale: expanded ? 1.15 : 1 }
          : expanded
            ? { scale: 1.28 }
            : breathing
              ? { scale: [1, 1.035, 1] }
              : { scale: 1 }
      }
      transition={
        expanded
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
      <Surface
        variant="glass-border"
        padding="none"
        radius="xl"
        className="relative flex size-28 items-center justify-center shadow-glow md:size-32"
      >
        <div
          className="absolute inset-3 rounded-[1.15rem] bg-gradient-blue opacity-20"
          aria-hidden
        />
        <Text
          as="span"
          variant="display"
          gradient="blue"
          className="relative text-[2.75rem] leading-none md:text-[3.25rem]"
        >
          M
        </Text>
      </Surface>
    </m.div>
  );
}
