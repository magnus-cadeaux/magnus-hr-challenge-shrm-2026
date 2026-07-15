"use client";

import { useCallback, useEffect, useState } from "react";
import { ENTRY_TRANSITION_MS } from "../mock-idle-stats";

export type EntryPhase = "idle" | "transitioning" | "welcome";

export function useEntryPhase() {
  const [phase, setPhase] = useState<EntryPhase>("idle");

  const beginTransition = useCallback(() => {
    setPhase((current) => (current === "idle" ? "transitioning" : current));
  }, []);

  useEffect(() => {
    if (phase !== "transitioning") return;

    const timer = window.setTimeout(() => {
      setPhase("welcome");
    }, ENTRY_TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  return {
    phase,
    isIdle: phase === "idle",
    isTransitioning: phase === "transitioning",
    isWelcome: phase === "welcome",
    beginTransition,
  } as const;
}
