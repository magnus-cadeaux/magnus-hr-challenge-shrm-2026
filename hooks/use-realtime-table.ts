"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type RealtimeTable =
  | "leaderboard"
  | "reward_inventory"
  | "reward_claims"
  | "participants"
  | "sales_profiles"
  | "event_settings";

interface UseRealtimeTableOptions<T extends Record<string, unknown>> {
  table: RealtimeTable;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  enabled?: boolean;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

/**
 * Subscribe to a shared multi-iPad table. No-ops when Supabase is offline/unconfigured.
 */
export function useRealtimeTable<T extends Record<string, unknown>>({
  table,
  event = "*",
  enabled = true,
  onChange,
}: UseRealtimeTableOptions<T>) {
  const [connected, setConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;

    let channel: RealtimeChannel | null = null;

    channel = client
      .channel(`magnus:${table}`)
      .on(
        "postgres_changes",
        { event, schema: "public", table },
        (payload) => {
          setLastEventAt(new Date().toISOString());
          onChange?.(payload as RealtimePostgresChangesPayload<T>);
        },
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      if (channel) {
        void client.removeChannel(channel);
      }
    };
  }, [table, event, enabled, onChange]);

  return { connected, lastEventAt } as const;
}
