import type { LeadIntelligenceInput, LeadIntelligenceProfile } from "./types";
import { deriveInteractionBehaviour } from "./behaviour";
import {
  computeLeadScore,
  resolveDecisionConfidence,
  resolveOrganisationMaturity,
} from "./scoring";
import {
  resolveBuyingInterests,
  resolveLikelyPriorities,
  resolvePainPoints,
  resolveRecommendedProducts,
} from "./inference";
import {
  resolveConversationStarters,
  resolveNextQuestion,
} from "./conversation-engine";

/**
 * Pure Sales Intelligence rule engine.
 * No AI · no network · fully config-driven and unit-testable.
 */
export function buildLeadIntelligenceProfile(
  input: LeadIntelligenceInput,
): LeadIntelligenceProfile {
  const behaviour = input.behaviour;
  const confidence = resolveDecisionConfidence(behaviour);
  const maturity = resolveOrganisationMaturity(
    input.participant.organization,
    input.signature,
  );
  const leadScore = computeLeadScore({
    participant: input.participant,
    signature: input.signature,
    behaviour,
    maturity,
    confidence,
  });

  const likelyPriorities = resolveLikelyPriorities(input.signature, 5);
  const likelyBuyingInterests = resolveBuyingInterests(
    input.signature,
    maturity,
    5,
  );
  const painPoints = resolvePainPoints(input.signature, 5);
  const recommendedProducts = resolveRecommendedProducts(
    input.signature,
    likelyBuyingInterests,
    painPoints,
    3,
  );
  const recommendedConversation = resolveConversationStarters(
    input.signature,
    input.participant.organization,
    likelyPriorities,
    painPoints,
    3,
  );
  const recommendedNextQuestion = resolveNextQuestion(
    input.signature,
    maturity,
    painPoints,
  );

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    sessionId: input.challenge.sessionId,
    participant: input.participant,
    leadScore,
    decisionConfidence: confidence,
    organisationMaturity: maturity,
    likelyPriorities,
    likelyBuyingInterests,
    painPoints,
    recommendedConversation,
    recommendedProducts,
    recommendedNextQuestion,
    signals: {
      primarySignatureId: input.signature.primary.id,
      secondarySignatureId: input.signature.secondary.id,
      profileScores: input.signature.normalizedScores,
      achievementIds: input.signature.achievements.map((item) => item.id),
      behaviour,
    },
  };
}

export function buildLeadIntelligenceFromSessions(input: {
  participant: LeadIntelligenceInput["participant"];
  challenge: LeadIntelligenceInput["challenge"];
  signature: LeadIntelligenceInput["signature"];
}): LeadIntelligenceProfile {
  return buildLeadIntelligenceProfile({
    ...input,
    behaviour: deriveInteractionBehaviour(input.challenge),
  });
}
