import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";
import type { LeadIntelligenceProfile } from "./types";
import {
  clearLeadIntelligenceProfile,
  readLeadIntelligenceProfile,
} from "./storage";
import { runSalesIntelligenceEngine } from "./compose-from-local";

export type SalesNotesRecord = {
  sessionId: string;
  notes: string;
  updatedAt: string;
};

/**
 * Prefer persisted Sprint 6 intelligence; if missing, rebuild from local Sprint 3–5 artefacts.
 */
export function loadSalesCompanionProfile(): LeadIntelligenceProfile | null {
  const existing = readLeadIntelligenceProfile();
  if (existing) return existing;
  return runSalesIntelligenceEngine();
}

export function readSalesNotes(sessionId: string): string {
  if (!isBrowser()) return "";
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.salesNotes);
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as SalesNotesRecord;
    if (parsed.sessionId !== sessionId) return "";
    return parsed.notes ?? "";
  } catch {
    return "";
  }
}

export function persistSalesNotes(sessionId: string, notes: string): void {
  if (!isBrowser()) return;
  const record: SalesNotesRecord = {
    sessionId,
    notes,
    updatedAt: new Date().toISOString(),
  };
  window.sessionStorage.setItem(
    STORAGE_KEYS.salesNotes,
    JSON.stringify(record),
  );
}

export function clearSalesNotes(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(STORAGE_KEYS.salesNotes);
}

export function markConversationComplete(sessionId: string): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(
    STORAGE_KEYS.salesConversationComplete,
    JSON.stringify({ sessionId, completedAt: new Date().toISOString() }),
  );
}

export function readConversationComplete(sessionId: string): boolean {
  if (!isBrowser()) return false;
  const raw = window.sessionStorage.getItem(
    STORAGE_KEYS.salesConversationComplete,
  );
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as { sessionId?: string };
    return parsed.sessionId === sessionId;
  } catch {
    return false;
  }
}

export function clearConversationComplete(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(STORAGE_KEYS.salesConversationComplete);
}

export function clearParticipantDraft(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(STORAGE_KEYS.participantDraft);
}

/**
 * Reset participant-facing local artefacts so staff can start a fresh booth cycle.
 */
export function clearParticipantLocalSession(): void {
  if (!isBrowser()) return;
  clearParticipantDraft();
  window.sessionStorage.removeItem(STORAGE_KEYS.challengeSession);
  window.sessionStorage.removeItem(STORAGE_KEYS.signatureProfile);
  window.sessionStorage.removeItem(STORAGE_KEYS.rewardAssignment);
  clearLeadIntelligenceProfile();
  clearSalesNotes();
  clearConversationComplete();
}

export function buildExportSummaryPlaceholder(
  profile: LeadIntelligenceProfile,
  notes: string,
): string {
  return [
    "Magnus Sales Companion — Summary Export",
    `Participant: ${profile.participant.fullName}`,
    `Organisation: ${profile.participant.organization}`,
    `Lead Score: ${profile.leadScore}`,
    `Signature: ${profile.signals.primarySignatureId} / ${profile.signals.secondarySignatureId}`,
    `Next Question: ${profile.recommendedNextQuestion}`,
    notes ? `Notes:\n${notes}` : "Notes: (none)",
    "",
    "(Placeholder — clipboard / file export will connect later.)",
  ].join("\n");
}
