import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";
import type { SignatureProfileResult } from "./types";
import { queueLocalWrite } from "@/services/sync/bridge";

export function persistSignatureProfile(profile: SignatureProfileResult): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(
    STORAGE_KEYS.signatureProfile,
    JSON.stringify(profile),
  );
  queueLocalWrite("signature_profiles", profile.sessionId, {
    local_session_id: profile.sessionId,
    primary_signature_id: profile.primary.id,
    secondary_signature_id: profile.secondary.id,
    display_name: profile.displayName,
    organization: profile.organization,
    scores: profile.scores,
    normalized_scores: profile.normalizedScores,
    insight: profile.insight,
    recommendations: profile.recommendations,
    percentile: profile.percentile,
  });
}

export function readSignatureProfile(): SignatureProfileResult | null {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.signatureProfile);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SignatureProfileResult;
  } catch {
    return null;
  }
}

export function clearSignatureProfile(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(STORAGE_KEYS.signatureProfile);
}
