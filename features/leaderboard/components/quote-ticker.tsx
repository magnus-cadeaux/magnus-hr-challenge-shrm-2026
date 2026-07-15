"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import { ARENA_QUOTES, SIMULATION_CONFIG } from "../config";

interface QuoteTickerProps {
  reduceMotion?: boolean;
}

export function QuoteTicker({ reduceMotion = false }: QuoteTickerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % ARENA_QUOTES.length);
    }, SIMULATION_CONFIG.quoteIntervalMs);
    return () => window.clearInterval(timer);
  }, []);

  const quote = ARENA_QUOTES[index] ?? ARENA_QUOTES[0]!;

  return (
    <div className="relative min-h-[3.5rem] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <m.div
          key={quote}
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }
          }
          transition={{
            duration: reduceMotion ? durations.fast : durations.slow,
            ease: easings.outExpo,
          }}
          style={{ willChange: "transform, opacity" }}
          className="absolute inset-x-0"
        >
          <Text
            variant="subtitle"
            align="center"
            className="mx-auto max-w-3xl text-lg italic text-blue-100/80 md:text-xl"
          >
            “{quote}”
          </Text>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
