import type { ChallengeSessionState } from "@/features/challenge/engine/types";
import type { InteractionBehaviour } from "./types";

export function deriveInteractionBehaviour(
  challenge: ChallengeSessionState,
): InteractionBehaviour {
  const endedAt = challenge.completedAt
    ? new Date(challenge.completedAt).getTime()
    : Date.now();
  const startedAt = new Date(challenge.startedAt).getTime();
  const elapsedMs = Math.max(0, endedAt - startedAt);
  const decisionsCompleted = challenge.answers.length;
  const averageDecisionMs =
    decisionsCompleted > 0 ? elapsedMs / decisionsCompleted : elapsedMs;

  const categoriesTouched = new Set(
    challenge.questions
      .filter((question) =>
        challenge.answers.some((answer) => answer.questionId === question.id),
      )
      .map((question) => question.category),
  ).size;

  const rankingCompletions = challenge.questions.filter((question) => {
    if (question.type !== "priority_ranking") return false;
    return challenge.answers.some((answer) => answer.questionId === question.id);
  }).length;

  return {
    averageDecisionMs,
    elapsedMs,
    decisionsCompleted,
    categoriesTouched,
    rankingCompletions,
  };
}
