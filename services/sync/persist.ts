import { getOfflineDatabase } from "@/services/storage/dexie";
import type { SyncEntity } from "@/services/storage/dexie";
import { enqueueSyncItem } from "./queue";

/**
 * Offline-first write path for participant actions:
 * Dexie session store → sync queue → (later) Supabase.
 */
export async function persistParticipantAction(input: {
  entity: SyncEntity;
  localKey: string;
  payload: Record<string, unknown>;
  operation?: "upsert" | "insert" | "update" | "delete";
}): Promise<void> {
  const db = getOfflineDatabase();
  const now = new Date().toISOString();

  await db.sessions.put({
    id: `${input.entity}:${input.localKey}`,
    participantId:
      typeof input.payload.participant_id === "string"
        ? input.payload.participant_id
        : undefined,
    createdAt: now,
    updatedAt: now,
    payload: {
      entity: input.entity,
      ...input.payload,
    },
  });

  await enqueueSyncItem({
    entity: input.entity,
    operation: input.operation ?? "upsert",
    payload: input.payload,
  });
}
