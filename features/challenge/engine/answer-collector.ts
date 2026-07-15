import type {
  ChallengeAnswerRecord,
  ChallengeOptionConfig,
  ChallengeSessionState,
  DimensionImpact,
  PreparedChallengeQuestion,
} from "./types";
import { mergeImpacts } from "./scoring";

function impactsFromOptions(
  options: ChallengeOptionConfig[],
  optionIds: string[],
): DimensionImpact {
  const selected = options.filter((option) => optionIds.includes(option.id));
  return selected.reduce<DimensionImpact>((acc, option) => {
    for (const [key, value] of Object.entries(option.impacts)) {
      if (value == null) continue;
      const dimension = key as keyof DimensionImpact;
      acc[dimension] = (acc[dimension] ?? 0) + value;
    }
    return acc;
  }, {});
}

/**
 * For ranking questions, weight earlier ranks more heavily using option impacts.
 */
function impactsFromRanking(
  options: ChallengeOptionConfig[],
  orderedIds: string[],
): DimensionImpact {
  const byId = new Map(options.map((option) => [option.id, option]));
  return orderedIds.reduce<DimensionImpact>((acc, optionId, index) => {
    const option = byId.get(optionId);
    if (!option) return acc;
    const weight = Math.max(orderedIds.length - index, 1);
    for (const [key, value] of Object.entries(option.impacts)) {
      if (value == null) continue;
      const dimension = key as keyof DimensionImpact;
      acc[dimension] = (acc[dimension] ?? 0) + value * weight;
    }
    return acc;
  }, {});
}

export function collectAnswer(
  question: PreparedChallengeQuestion,
  optionIds: string[],
): ChallengeAnswerRecord {
  const impacts =
    question.type === "priority_ranking"
      ? impactsFromRanking(question.options, optionIds)
      : impactsFromOptions(question.options, optionIds);

  return {
    questionId: question.id,
    optionIds,
    answeredAt: new Date().toISOString(),
    impacts,
  };
}

export function applyAnswerToSession(
  session: ChallengeSessionState,
  answer: ChallengeAnswerRecord,
): ChallengeSessionState {
  const question = session.questions[session.currentIndex];

  return {
    ...session,
    answers: [...session.answers, answer],
    dimensionScores: mergeImpacts(session.dimensionScores, answer.impacts),
    phase: "insight",
    lastInsight: question?.insight,
    lastAnswerOptionIds: answer.optionIds,
  };
}

export function advanceAfterInsight(
  session: ChallengeSessionState,
): ChallengeSessionState {
  const nextIndex = session.currentIndex + 1;
  const complete = nextIndex >= session.questions.length;

  if (complete) {
    return {
      ...session,
      currentIndex: nextIndex,
      phase: "complete",
      status: "completed",
      completedAt: new Date().toISOString(),
      lastInsight: undefined,
      lastAnswerOptionIds: undefined,
    };
  }

  return {
    ...session,
    currentIndex: nextIndex,
    phase: "question",
    lastInsight: undefined,
    lastAnswerOptionIds: undefined,
  };
}

export function getCurrentQuestion(
  session: ChallengeSessionState,
): PreparedChallengeQuestion | null {
  return session.questions[session.currentIndex] ?? null;
}
