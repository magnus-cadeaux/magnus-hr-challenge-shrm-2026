import { queueLocalWrite } from "@/services/sync/bridge";
import { isBrowser } from "@/utils/device";
import { getActiveEventDay } from "./event-day";

export type LeaderboardWriteInput = {
  /** Local challenge / signature session id — used as Dexie localKey. */
  localSessionId: string;
  participantId?: string | null;
  displayName: string;
  companyName: string;
  score: number;
  signatureId: string;
  signatureName: string;
  eventDay?: string;
};

/**
 * Persist one leaderboard row locally (Dexie + sync queue).
 * `localSessionId` is the Dexie localKey (`leaderboard:<sessionId>`).
 * Payload columns match public.leaderboard.
 */
export function persistLeaderboardEntry(input: LeaderboardWriteInput): void {
  if (!isBrowser()) return;

  queueLocalWrite("leaderboard", input.localSessionId, {
    participant_id: input.participantId ?? null,
    display_name: input.displayName,
    company_name: input.companyName,
    score: input.score,
    signature_id: input.signatureId,
    signature_name: input.signatureName,
    event_day: input.eventDay ?? getActiveEventDay(),
    updated_at: new Date().toISOString(),
  });
}
