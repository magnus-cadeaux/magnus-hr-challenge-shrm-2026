import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";

/** Participant-facing session keys cleared by kiosk idle reset. */
export const PARTICIPANT_SESSION_KEYS = [
  STORAGE_KEYS.participantDraft,
  STORAGE_KEYS.sessionId,
  STORAGE_KEYS.challengeSession,
  STORAGE_KEYS.signatureProfile,
  STORAGE_KEYS.leadIntelligence,
  STORAGE_KEYS.rewardAssignment,
  STORAGE_KEYS.salesNotes,
  STORAGE_KEYS.salesConversationComplete,
] as const;

/**
 * Clears the active booth participant journey only.
 * Does NOT clear Dexie analytics or sync queue history.
 */
export function clearParticipantSession(): void {
  if (!isBrowser()) return;
  for (const key of PARTICIPANT_SESSION_KEYS) {
    window.sessionStorage.removeItem(key);
  }
}

export const KIOSK_IDLE_MS = 90_000;
