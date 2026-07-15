import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";
import type { LeadIntelligenceProfile } from "./types";
import { queueLocalWrite } from "@/services/sync/bridge";

export function persistLeadIntelligenceProfile(
  profile: LeadIntelligenceProfile,
): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(
    STORAGE_KEYS.leadIntelligence,
    JSON.stringify(profile),
  );
  queueLocalWrite("sales_profiles", profile.sessionId, {
    local_session_id: profile.sessionId,
    lead_score: profile.leadScore,
    decision_confidence: profile.decisionConfidence,
    organisation_maturity: profile.organisationMaturity,
    profile,
    conversation_status: "pending",
  });
}

export function readLeadIntelligenceProfile(): LeadIntelligenceProfile | null {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.leadIntelligence);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LeadIntelligenceProfile;
  } catch {
    return null;
  }
}

export function clearLeadIntelligenceProfile(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(STORAGE_KEYS.leadIntelligence);
}
