"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useRealtimeTable } from "@/hooks/use-realtime-table";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import {
  buildArenaSnapshotFromStandings,
  emptyArenaSnapshot,
} from "../engine/build-snapshot";
import { getActiveEventDay } from "../engine/event-day";
import {
  readLocalLeaderboardStandings,
  type LeaderboardStandingRow,
} from "../engine/local-standings";
import type { ArenaSnapshot } from "../engine/types";

const LOCAL_POLL_MS = 2000;

type RemoteLeaderboardRow = {
  id?: string;
  participant_id?: string | null;
  display_name?: string;
  company_name?: string | null;
  score?: number;
  signature_id?: string | null;
  signature_name?: string | null;
  event_day?: string;
};

function rowFromRemote(row: RemoteLeaderboardRow): LeaderboardStandingRow | null {
  const displayName = (row.display_name ?? "").trim();
  if (!displayName) return null;

  const localSessionId =
    (typeof row.participant_id === "string" && row.participant_id) ||
    (typeof row.id === "string" && row.id) ||
    "";

  if (!localSessionId) return null;

  return {
    id: typeof row.id === "string" ? row.id : `leaderboard:${localSessionId}`,
    localSessionId,
    participantId:
      typeof row.participant_id === "string" ? row.participant_id : null,
    displayName,
    companyName: (row.company_name ?? "").trim() || "—",
    score: typeof row.score === "number" ? row.score : 0,
    signatureId: row.signature_id ?? "",
    signatureName: (row.signature_name ?? "").trim() || "—",
    eventDay: row.event_day ?? getActiveEventDay(),
  };
}

function mergeStanding(
  current: LeaderboardStandingRow[],
  next: LeaderboardStandingRow,
): LeaderboardStandingRow[] {
  const without = current.filter(
    (row) =>
      row.localSessionId !== next.localSessionId && row.id !== next.id,
  );
  return [...without, next].sort((a, b) => b.score - a.score);
}

/**
 * Live arena standings from Supabase realtime when configured,
 * otherwise Dexie local leaderboard rows for the current event day.
 */
export function useRealArena(enabled = true): ArenaSnapshot {
  const [snapshot, setSnapshot] = useState<ArenaSnapshot>(emptyArenaSnapshot);
  const previousRef = useRef<ArenaSnapshot | null>(null);
  const rowsRef = useRef<LeaderboardStandingRow[]>([]);
  const live = isSupabaseConfigured();

  const applyRows = useCallback((rows: LeaderboardStandingRow[]) => {
    const eventDay = getActiveEventDay();
    const filtered = rows
      .filter((row) => row.eventDay === eventDay)
      .sort((a, b) => b.score - a.score);
    rowsRef.current = filtered;
    const next = buildArenaSnapshotFromStandings(
      filtered,
      previousRef.current,
    );
    previousRef.current = next;
    setSnapshot(next);
  }, []);

  const loadLocal = useCallback(async () => {
    const rows = await readLocalLeaderboardStandings();
    applyRows(rows);
  }, [applyRows]);

  const loadRemote = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      await loadLocal();
      return;
    }

    const { data, error } = await client
      .from("leaderboard")
      .select("*")
      .eq("event_day", getActiveEventDay())
      .order("score", { ascending: false });

    if (error || !data) {
      await loadLocal();
      return;
    }

    applyRows(
      data
        .map((row) => rowFromRemote(row as RemoteLeaderboardRow))
        .filter((row): row is LeaderboardStandingRow => row != null),
    );
  }, [applyRows, loadLocal]);

  useEffect(() => {
    if (!enabled) return;
    if (live) {
      void loadRemote();
    } else {
      void loadLocal();
    }
  }, [enabled, live, loadLocal, loadRemote]);

  useEffect(() => {
    if (!enabled || live) return;

    const timer = window.setInterval(() => {
      void loadLocal();
    }, LOCAL_POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") void loadLocal();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, live, loadLocal]);

  const onRealtimeChange = useCallback(
    (payload: RealtimePostgresChangesPayload<RemoteLeaderboardRow>) => {
      if (payload.eventType === "DELETE") {
        const oldRow = rowFromRemote(
          (payload.old ?? {}) as RemoteLeaderboardRow,
        );
        if (!oldRow) return;
        applyRows(
          rowsRef.current.filter(
            (row) =>
              row.id !== oldRow.id &&
              row.localSessionId !== oldRow.localSessionId,
          ),
        );
        return;
      }

      const next = rowFromRemote((payload.new ?? {}) as RemoteLeaderboardRow);
      if (!next || next.eventDay !== getActiveEventDay()) return;
      applyRows(mergeStanding(rowsRef.current, next));
    },
    [applyRows],
  );

  useRealtimeTable<RemoteLeaderboardRow>({
    table: "leaderboard",
    enabled: enabled && live,
    onChange: onRealtimeChange,
  });

  return snapshot;
}
