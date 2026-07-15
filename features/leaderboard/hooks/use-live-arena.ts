"use client";

import { useEffect, useRef, useState } from "react";
import { isDemoMode } from "@/lib/env";
import {
  createInitialSnapshot,
  advanceArenaTick,
  nextTickDelayMs,
  type ArenaSnapshot,
  type ArenaRuntime,
} from "../engine";
import { SIMULATION_CONFIG } from "../config";
import { useRealArena } from "./use-real-arena";

function useSimulatedArena(enabled: boolean): ArenaSnapshot {
  const boot = useRef<ReturnType<typeof createInitialSnapshot> | null>(null);
  if (!boot.current) {
    boot.current = createInitialSnapshot();
  }

  const [snapshot, setSnapshot] = useState<ArenaSnapshot>(
    () => boot.current!.snapshot,
  );
  const runtimeRef = useRef<ArenaRuntime>(boot.current.runtime);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timer: number | undefined;

    const schedule = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        const result = advanceArenaTick(
          runtimeRef.current,
          snapshotRef.current,
        );
        runtimeRef.current = result.runtime;
        snapshotRef.current = result.snapshot;
        setSnapshot(result.snapshot);
        schedule();
      }, nextTickDelayMs(SIMULATION_CONFIG));
    };

    schedule();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !snapshot.moment) return;
    const momentId = snapshot.moment.id;
    const timer = window.setTimeout(() => {
      setSnapshot((current) =>
        current.moment?.id === momentId
          ? { ...current, moment: null }
          : current,
      );
    }, SIMULATION_CONFIG.momentDurationMs);
    return () => window.clearTimeout(timer);
  }, [enabled, snapshot.moment]);

  return snapshot;
}

/**
 * Arena data source:
 * - NEXT_PUBLIC_DEMO_MODE=true → legacy simulation (never default)
 * - otherwise → real leaderboard (Supabase realtime or local Dexie)
 */
export function useLiveArena(enabled = true) {
  const demo = isDemoMode();
  const simulated = useSimulatedArena(enabled && demo);
  const real = useRealArena(enabled && !demo);
  return demo ? simulated : real;
}
