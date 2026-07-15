"use client";

import { useEffect, useState } from "react";
import { IDLE_CARD_INTERVAL_MS, IDLE_INSIGHT_CARDS } from "../mock-idle-stats";

export function useRotatingInsightIndex(active: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % IDLE_INSIGHT_CARDS.length);
    }, IDLE_CARD_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [active]);

  return {
    index,
    card: IDLE_INSIGHT_CARDS[index],
    total: IDLE_INSIGHT_CARDS.length,
  } as const;
}
