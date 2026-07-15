import { isBrowser } from "@/utils/device";
import {
  getOfflineDatabase,
  type SyncEntity,
  type SyncOperation,
  type SyncQueueRecord,
} from "@/services/storage/dexie";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function enqueueSyncItem(input: {
  entity: SyncEntity;
  operation?: SyncOperation;
  payload: Record<string, unknown>;
}): Promise<SyncQueueRecord | null> {
  if (!isBrowser()) return null;

  const now = new Date().toISOString();
  const record: SyncQueueRecord = {
    id: createId(),
    entity: input.entity,
    operation: input.operation ?? "upsert",
    payload: input.payload,
    status: "pending",
    attempts: 0,
    createdAt: now,
    updatedAt: now,
    nextAttemptAt: now,
    clientTimestamp: now,
  };

  await getOfflineDatabase().syncQueue.put(record);
  return record;
}

export async function listPendingSyncItems(limit = 40): Promise<SyncQueueRecord[]> {
  if (!isBrowser()) return [];
  const now = new Date().toISOString();
  const db = getOfflineDatabase();
  const pending = await db.syncQueue
    .where("status")
    .anyOf(["pending", "failed"])
    .sortBy("nextAttemptAt");

  return pending
    .filter((item) => item.nextAttemptAt <= now)
    .slice(0, limit);
}

export async function markSyncItem(
  id: string,
  patch: Partial<SyncQueueRecord>,
): Promise<void> {
  if (!isBrowser()) return;
  await getOfflineDatabase().syncQueue.update(id, {
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export async function removeSyncItem(id: string): Promise<void> {
  if (!isBrowser()) return;
  await getOfflineDatabase().syncQueue.delete(id);
}

/** Exponential backoff in ms: 2s, 4s, 8s … capped at 5 minutes */
export function nextBackoffMs(attempts: number): number {
  return Math.min(2 ** Math.max(attempts, 1) * 1000, 5 * 60 * 1000);
}

/**
 * Last-write-wins conflict resolution.
 * Returns true when local write should replace remote.
 */
export function shouldPreferLocal(
  localTimestamp: string,
  remoteUpdatedAt?: string | null,
): boolean {
  if (!remoteUpdatedAt) return true;
  return new Date(localTimestamp).getTime() >= new Date(remoteUpdatedAt).getTime();
}
