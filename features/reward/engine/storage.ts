import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";
import type { RewardAssignment } from "./types";
import { queueLocalWrite } from "@/services/sync/bridge";

export function persistRewardAssignment(assignment: RewardAssignment): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(
    STORAGE_KEYS.rewardAssignment,
    JSON.stringify(assignment),
  );
  queueLocalWrite("rewards", assignment.sessionId, {
    local_session_id: assignment.sessionId,
    gift_key: assignment.gift.id,
    gift_name: assignment.gift.name,
    tier: assignment.gift.tier,
    collection_code: assignment.collectionCode,
    upgraded: assignment.upgraded,
    base_gift_key: assignment.baseGiftId,
    assigned_at: assignment.assignedAt,
  });
}

export function readRewardAssignment(): RewardAssignment | null {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.rewardAssignment);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RewardAssignment;
  } catch {
    return null;
  }
}
