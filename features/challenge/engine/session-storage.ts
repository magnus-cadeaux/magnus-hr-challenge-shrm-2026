import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";
import type { ChallengeSessionState } from "../engine/types";
import { computeChallengeScore } from "./scoring";
import { queueLocalWrite } from "@/services/sync/bridge";

function elapsedMsFor(session: ChallengeSessionState): number | null {
  if (!session.completedAt) return null;
  return (
    new Date(session.completedAt).getTime() -
    new Date(session.startedAt).getTime()
  );
}

export function persistChallengeSession(session: ChallengeSessionState): void {
  if (!isBrowser()) return;

  const elapsedMs = elapsedMsFor(session);
  const score =
    session.status === "completed" && elapsedMs != null
      ? (session.score ??
        computeChallengeScore(session.dimensionScores, elapsedMs))
      : session.score;

  const nextSession: ChallengeSessionState =
    score != null ? { ...session, score } : session;

  window.sessionStorage.setItem(
    STORAGE_KEYS.challengeSession,
    JSON.stringify(nextSession),
  );
  queueLocalWrite("challenge_sessions", nextSession.sessionId, {
    local_session_id: nextSession.sessionId,
    status: nextSession.status,
    question_ids: nextSession.questions.map((q) => q.id),
    dimension_scores: nextSession.dimensionScores,
    started_at: nextSession.startedAt,
    completed_at: nextSession.completedAt,
    elapsed_ms: elapsedMs,
  });
}

export function readChallengeSession(): ChallengeSessionState | null {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.challengeSession);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ChallengeSessionState;
  } catch {
    return null;
  }
}

export function clearChallengeSession(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(STORAGE_KEYS.challengeSession);
}
