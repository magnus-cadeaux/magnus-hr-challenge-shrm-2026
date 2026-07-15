import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";
import { readChallengeSession } from "@/features/challenge/engine/session-storage";
import {
  readSignatureProfile,
  type SignatureProfileResult,
} from "@/features/signature/engine";
import type { ChallengeSessionState } from "@/features/challenge/engine/types";
import type { LeadIntelligenceProfile, LeadParticipantInput } from "./types";
import { buildLeadIntelligenceFromSessions } from "./build-lead-profile";
import { persistLeadIntelligenceProfile } from "./storage";
import { SIGNATURE_PROFILE_DEFAULTS } from "@/features/signature/config/defaults";
import { queueLocalWrite } from "@/services/sync/bridge";

export type StoredParticipantDraft = Partial<LeadParticipantInput> & {
  fullName?: string;
  organization?: string;
  email?: string;
  phone?: string;
};

export function readParticipantDraft(): StoredParticipantDraft | null {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.participantDraft);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredParticipantDraft;
  } catch {
    return null;
  }
}

export function persistParticipantDraft(draft: StoredParticipantDraft): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(
    STORAGE_KEYS.participantDraft,
    JSON.stringify(draft),
  );
  queueLocalWrite("participants", draft.email || draft.fullName || "draft", {
    full_name: draft.fullName ?? "",
    email: draft.email ?? null,
    phone: draft.phone ?? null,
    company_name: draft.organization ?? null,
    local_session_id: window.sessionStorage.getItem(STORAGE_KEYS.sessionId),
  });
}

function resolveParticipant(
  signature: SignatureProfileResult,
  draft: StoredParticipantDraft | null,
): LeadParticipantInput {
  return {
    fullName:
      draft?.fullName?.trim() ||
      signature.displayName ||
      SIGNATURE_PROFILE_DEFAULTS.displayName,
    organization:
      draft?.organization?.trim() ||
      signature.organization ||
      SIGNATURE_PROFILE_DEFAULTS.organization,
    email: draft?.email?.trim() || "",
    phone: draft?.phone?.trim() || "",
  };
}

/**
 * Silently compose + persist lead intelligence from local Sprint 4/5 artefacts.
 */
export function runSalesIntelligenceEngine(options?: {
  challenge?: ChallengeSessionState | null;
  signature?: SignatureProfileResult | null;
  participant?: StoredParticipantDraft | null;
}): LeadIntelligenceProfile | null {
  const challenge = options?.challenge ?? readChallengeSession();
  const signature = options?.signature ?? readSignatureProfile();
  if (!challenge || !signature) return null;

  const participant = resolveParticipant(
    signature,
    options?.participant ?? readParticipantDraft(),
  );

  const profile = buildLeadIntelligenceFromSessions({
    participant,
    challenge,
    signature,
  });

  persistLeadIntelligenceProfile(profile);
  return profile;
}
