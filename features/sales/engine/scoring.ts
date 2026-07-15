import {
  CONFIDENCE_THRESHOLDS,
  LEAD_SCORE_WEIGHTS,
  MATURITY_BY_COMPANY,
  MATURITY_FROM_PROFILE,
} from "../config/catalogs";
import type {
  DecisionConfidence,
  InteractionBehaviour,
  LeadParticipantInput,
  OrganisationMaturity,
} from "./types";
import type { SignatureProfileResult } from "@/features/signature/engine/types";
import { averageScore, clampScore } from "./utils";

export function resolveDecisionConfidence(
  behaviour: InteractionBehaviour,
): DecisionConfidence {
  const { averageDecisionMs, decisionsCompleted } = behaviour;

  if (
    decisionsCompleted >= CONFIDENCE_THRESHOLDS.highMinDecisions &&
    averageDecisionMs <= CONFIDENCE_THRESHOLDS.highMaxAverageMs
  ) {
    return "high";
  }

  if (averageDecisionMs <= CONFIDENCE_THRESHOLDS.mediumMaxAverageMs) {
    return "medium";
  }

  return "low";
}

export function resolveOrganisationMaturity(
  organization: string,
  signature: SignatureProfileResult,
): OrganisationMaturity {
  const known = MATURITY_BY_COMPANY[organization];
  const scores = signature.normalizedScores;
  const avg = averageScore(scores);

  const fromProfile =
    MATURITY_FROM_PROFILE.find(
      (rule) =>
        scores.strategy >= rule.minStrategy &&
        scores.execution >= rule.minExecution &&
        avg >= rule.minAverage,
    )?.id ?? "emerging";

  if (!known) return fromProfile;

  const order: OrganisationMaturity[] = [
    "emerging",
    "growing",
    "mature",
    "enterprise",
  ];
  const knownIndex = order.indexOf(known);
  const profileIndex = order.indexOf(fromProfile);
  return order[Math.max(knownIndex, profileIndex)] ?? fromProfile;
}

export function computeLeadScore(input: {
  participant: LeadParticipantInput;
  signature: SignatureProfileResult;
  behaviour: InteractionBehaviour;
  maturity: OrganisationMaturity;
  confidence: DecisionConfidence;
}): number {
  const { participant, signature, behaviour, maturity, confidence } = input;
  const scores = signature.normalizedScores;

  const signatureStrength =
    (averageScore(scores) / 100) * LEAD_SCORE_WEIGHTS.signatureStrength;

  const engagementRaw = Math.min(
    1,
    behaviour.decisionsCompleted / 6 * 0.45 +
      behaviour.categoriesTouched / 6 * 0.25 +
      (behaviour.rankingCompletions > 0 ? 0.15 : 0) +
      (behaviour.averageDecisionMs < 20_000 ? 0.15 : 0.05),
  );
  const engagement = engagementRaw * LEAD_SCORE_WEIGHTS.engagement;

  const identityFields = [
    participant.fullName,
    participant.organization,
    participant.email,
    participant.phone,
  ].filter((value) => value.trim().length > 0).length;
  const identityCompleteness =
    (identityFields / 4) * LEAD_SCORE_WEIGHTS.identityCompleteness;

  const achievementSignal =
    Math.min(signature.achievements.length / 3, 1) *
    LEAD_SCORE_WEIGHTS.achievementSignal;

  const maturityFitMap: Record<OrganisationMaturity, number> = {
    emerging: 0.45,
    growing: 0.7,
    mature: 0.9,
    enterprise: 1,
  };
  const maturityFit =
    maturityFitMap[maturity] * LEAD_SCORE_WEIGHTS.maturityFit;

  const confidenceMap: Record<DecisionConfidence, number> = {
    low: 0.35,
    medium: 0.7,
    high: 1,
  };
  const confidenceBoost =
    confidenceMap[confidence] * LEAD_SCORE_WEIGHTS.confidenceBoost;

  return clampScore(
    signatureStrength +
      engagement +
      identityCompleteness +
      achievementSignal +
      maturityFit +
      confidenceBoost,
  );
}
