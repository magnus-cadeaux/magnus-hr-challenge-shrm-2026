import { persistParticipantAction } from "@/services/sync/persist";
import type { SyncEntity } from "@/services/storage/dexie";

/**
 * Fire-and-forget enqueue so existing sync sessionStorage APIs stay sync.
 * Failures never throw into the participant UI.
 */
export function queueLocalWrite(
  entity: SyncEntity,
  localKey: string,
  payload: Record<string, unknown>,
): void {
  void persistParticipantAction({
    entity,
    localKey,
    payload,
  }).catch(() => {
    /* degrade gracefully */
  });
}
