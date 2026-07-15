import { getOfflineDatabase } from "@/services/storage/dexie";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { isBrowser } from "@/utils/device";
import {
  getActiveEventDay,
  startNewEventDay,
} from "@/features/leaderboard/engine/event-day";
import { resetInventoryProvider } from "@/features/reward/engine/inventory-provider";
import { MOCK_INVENTORY } from "@/features/reward/config/inventory";
import { resetLocalInventoryTier } from "../config/inventory-store";

/** Delete today's leaderboard rows from Dexie (+ sync queue), and Supabase when configured. */
export async function resetLeaderboardToday(): Promise<{ deleted: number }> {
  const eventDay = getActiveEventDay();
  const db = getOfflineDatabase();

  const rows = await db.sessions
    .filter((row) => row.id.startsWith("leaderboard:"))
    .toArray();

  const toDelete = rows.filter((row) => {
    const day =
      typeof row.payload.event_day === "string" ? row.payload.event_day : "";
    return day === eventDay;
  });

  await Promise.all(toDelete.map((row) => db.sessions.delete(row.id)));

  const queued = await db.syncQueue
    .filter((item) => item.entity === "leaderboard")
    .toArray();
  await Promise.all(
    queued
      .filter((item) => item.payload.event_day === eventDay)
      .map((item) => db.syncQueue.delete(item.id)),
  );

  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client.from("leaderboard") as any).delete().eq("event_day", eventDay);
    }
  }

  return { deleted: toDelete.length };
}

/** Zero reserved + distributed on inventory; leave stock untouched. */
export async function resetRewardCounters(): Promise<void> {
  resetInventoryProvider(
    MOCK_INVENTORY.map((item) => ({ ...item, reserved: 0 })),
  );
  resetLocalInventoryTier();

  const db = getOfflineDatabase();
  const rows = await db.sessions
    .filter((row) => row.id.startsWith("reward_inventory:"))
    .toArray();

  await Promise.all(
    rows.map((row) =>
      db.sessions.put({
        ...row,
        updatedAt: new Date().toISOString(),
        payload: {
          ...row.payload,
          reserved: 0,
          distributed: 0,
        },
      }),
    ),
  );

  if (isSupabaseConfigured()) {
    const client = getSupabaseBrowserClient();
    if (client) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client.from("reward_inventory") as any)
        .update({ reserved: 0, distributed: 0 })
        .neq("gift_key", "");
    }
  }
}

/** Advance the active event day so standings start empty without redeploying. */
export function startNewLeaderboardDay(): string {
  if (!isBrowser()) return getActiveEventDay();
  return startNewEventDay();
}
