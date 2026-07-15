import type { ChallengeSessionState } from "@/features/challenge/engine/types";
import { SIGNATURE_PROFILE_DEFAULTS } from "../config/defaults";
import { resolveSignatures } from "./signature-engine";
import { selectRecommendations } from "./recommendation-engine";
import { selectAchievements } from "./achievement-engine";
import { resolveExecutiveInsight } from "./insight-engine";
import {
  mapChallengeScoresToProfile,
  normalizeProfileScores,
} from "./profile-mapper";
import type { SignatureProfileResult } from "./types";

function mockPercentile(sessionId: string): number {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i += 1) {
    hash = (hash + sessionId.charCodeAt(i) * (i + 1)) % 1000;
  }
  const span =
    SIGNATURE_PROFILE_DEFAULTS.percentileMax -
    SIGNATURE_PROFILE_DEFAULTS.percentileMin;
  return (
    SIGNATURE_PROFILE_DEFAULTS.percentileMin + (hash % (span + 1))
  );
}

export function buildSignatureProfile(
  session: ChallengeSessionState,
  identity?: {
    displayName?: string;
    organization?: string;
  },
): SignatureProfileResult {
  const scores = mapChallengeScoresToProfile(session.dimensionScores);
  const normalizedScores = normalizeProfileScores(scores);
  const { primary, secondary } = resolveSignatures(scores);

  return {
    sessionId: session.sessionId,
    displayName:
      identity?.displayName?.trim() ||
      SIGNATURE_PROFILE_DEFAULTS.displayName,
    organization:
      identity?.organization?.trim() ||
      SIGNATURE_PROFILE_DEFAULTS.organization,
    scores,
    normalizedScores,
    primary,
    secondary,
    insight: resolveExecutiveInsight(primary, secondary),
    recommendations: selectRecommendations(primary, secondary),
    achievements: selectAchievements(scores, primary, session),
    percentile: mockPercentile(session.sessionId),
    challengeScores: session.dimensionScores,
  };
}
