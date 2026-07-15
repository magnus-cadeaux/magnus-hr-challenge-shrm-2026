import { getOfflineDatabase } from "@/services/storage/dexie";
import { getActiveEventDay } from "./event-day";

export type LeaderboardStandingRow = {
  id: string;
  localSessionId: string;
  participantId: string | null;
  displayName: string;
  companyName: string;
  score: number;
  signatureId: string;
  signatureName: string;
  eventDay: string;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseStanding(
  recordId: string,
  payload: Record<string, unknown>,
): LeaderboardStandingRow | null {
  const displayName = asString(payload.display_name).trim();
  if (!displayName) return null;

  const localSessionId = recordId.replace(/^leaderboard:/, "");

  return {
    id: recordId,
    localSessionId,
    participantId:
      typeof payload.participant_id === "string" ? payload.participant_id : null,
    displayName,
    companyName: asString(payload.company_name).trim() || "—",
    score: asNumber(payload.score),
    signatureId: asString(payload.signature_id),
    signatureName: asString(payload.signature_name).trim() || "—",
    eventDay: asString(payload.event_day),
  };
}

/** Dexie-backed standings for the active event_day, score descending. */
export async function readLocalLeaderboardStandings(
  eventDay = getActiveEventDay(),
): Promise<LeaderboardStandingRow[]> {
  const db = getOfflineDatabase();
  const rows = await db.sessions
    .filter((row) => row.id.startsWith("leaderboard:"))
    .toArray();

  return rows
    .map((row) => parseStanding(row.id, row.payload))
    .filter((entry): entry is LeaderboardStandingRow => {
      if (!entry) return false;
      return entry.eventDay === eventDay;
    })
    .sort((a, b) => b.score - a.score);
}
