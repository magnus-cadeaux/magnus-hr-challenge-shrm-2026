import type { ChallengeSessionState } from "@/features/challenge/engine/types";
import type { SignatureProfileResult } from "@/features/signature/engine/types";
import { EMPTY_DIMENSION_SCORES } from "@/features/challenge/engine/types";
import { EMPTY_PROFILE_SCORES } from "@/features/signature/engine/types";
import type { LeadIntelligenceInput } from "./types";

/**
 * Deterministic fixture for unit tests / local verification of the rule engine.
 */
export function createSampleLeadIntelligenceInput(): LeadIntelligenceInput {
  const startedAt = new Date(Date.now() - 90_000).toISOString();
  const completedAt = new Date().toISOString();

  const challenge: ChallengeSessionState = {
    sessionId: "challenge_sample",
    status: "completed",
    questions: [],
    currentIndex: 6,
    answers: [
      {
        questionId: "q1",
        optionIds: ["a"],
        answeredAt: startedAt,
        impacts: { innovation: 3, execution: 1 },
      },
      {
        questionId: "q2",
        optionIds: ["b"],
        answeredAt: startedAt,
        impacts: { empathy: 2, culture: 2 },
      },
    ],
    dimensionScores: {
      ...EMPTY_DIMENSION_SCORES,
      innovation: 12,
      culture: 8,
      execution: 14,
      empathy: 10,
      sustainability: 6,
      recognition: 9,
    },
    phase: "complete",
    startedAt,
    completedAt,
  };

  const signature: SignatureProfileResult = {
    sessionId: "challenge_sample",
    displayName: "Asha Rao",
    organization: "Infosys",
    scores: { ...EMPTY_PROFILE_SCORES },
    normalizedScores: {
      innovation: 72,
      culture: 61,
      sustainability: 48,
      execution: 80,
      experience: 74,
      strategy: 66,
      connection: 70,
      growth: 58,
    },
    primary: {
      id: "execution_expert",
      name: "Execution Expert",
      dimension: "execution",
      summary: "Reliable delivery at scale.",
    },
    secondary: {
      id: "experience_curator",
      name: "Experience Curator",
      dimension: "experience",
      summary: "Memorable employee moments.",
    },
    insight: "Sample insight",
    recommendations: [],
    achievements: [
      {
        id: "ach-people-first",
        title: "People First",
        description: "Human impact stayed visible.",
        dimension: "experience",
        rule: "top_dimension",
      },
    ],
    percentile: 12,
    challengeScores: challenge.dimensionScores,
  };

  return {
    participant: {
      fullName: "Asha Rao",
      organization: "Infosys",
      email: "asha.rao@example.com",
      phone: "9876543210",
    },
    challenge,
    signature,
    behaviour: {
      averageDecisionMs: 12_000,
      elapsedMs: 72_000,
      decisionsCompleted: 6,
      categoriesTouched: 5,
      rankingCompletions: 1,
    },
  };
}
