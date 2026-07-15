import { getSupabaseBrowserClient } from "@/services/supabase/client";
import type { SyncEntity, SyncQueueRecord } from "@/services/storage/dexie";
import {
  listPendingSyncItems,
  markSyncItem,
  nextBackoffMs,
  removeSyncItem,
  shouldPreferLocal,
} from "./queue";

type TableName = SyncEntity;

async function pushRecord(item: SyncQueueRecord): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { ok: false, error: "Supabase not configured" };
  }

  const table = item.entity as TableName;
  const payload = item.payload;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const from = client.from(table) as any;

    if (item.operation === "delete" && typeof payload.id === "string") {
      const { error } = await from.delete().eq("id", payload.id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }

    if (typeof payload.id === "string") {
      const { data: remote } = await from
        .select("updated_at")
        .eq("id", payload.id)
        .maybeSingle();

      const remoteUpdated =
        remote && typeof remote === "object" && "updated_at" in remote
          ? (remote.updated_at as string | null)
          : null;

      if (
        remoteUpdated &&
        !shouldPreferLocal(item.clientTimestamp, remoteUpdated)
      ) {
        await markSyncItem(item.id, {
          status: "conflict",
          lastError: "Remote newer — kept remote (LWW)",
        });
        return { ok: true };
      }
    }

    const { error } = await from.upsert(payload, { onConflict: "id" });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown sync error",
    };
  }
}

let flushing = false;

/**
 * Drain the offline sync queue to Supabase with automatic retry.
 * Safe to call frequently; concurrent flushes coalesce.
 */
export async function flushSyncQueue(): Promise<{
  processed: number;
  remaining: number;
}> {
  if (flushing) return { processed: 0, remaining: -1 };
  flushing = true;

  let processed = 0;

  try {
    const items = await listPendingSyncItems();
    for (const item of items) {
      await markSyncItem(item.id, { status: "syncing" });
      const result = await pushRecord(item);

      if (result.ok) {
        const { getOfflineDatabase } = await import("@/services/storage/dexie");
        const current = await getOfflineDatabase().syncQueue.get(item.id);
        if (current?.status !== "conflict") {
          await removeSyncItem(item.id);
        }
        processed += 1;
      } else {
        const attempts = item.attempts + 1;
        const delay = nextBackoffMs(attempts);
        await markSyncItem(item.id, {
          status: "failed",
          attempts,
          lastError: result.error,
          nextAttemptAt: new Date(Date.now() + delay).toISOString(),
        });
      }
    }

    const remaining = (await listPendingSyncItems(1000)).length;
    return { processed, remaining };
  } finally {
    flushing = false;
  }
}

export function isSyncAvailable(): boolean {
  return Boolean(getSupabaseBrowserClient());
}
