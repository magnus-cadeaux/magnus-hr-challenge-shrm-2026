import { createId } from "@/utils/guards";
import { QUESTION_BANK } from "../config/question-bank";
import { pickUnique, shuffleArray } from "./randomizer";
import {
  EMPTY_DIMENSION_SCORES,
  QUESTIONS_PER_SESSION,
  type ChallengeQuestionConfig,
  type ChallengeSessionState,
  type PreparedChallengeQuestion,
} from "./types";
import { isBrowser } from "@/utils/device";
import { peekManagedQuestionBank } from "@/features/admin/question-bank/provider";
import { toChallengeConfig } from "@/features/admin/question-bank/types";

function readManagedBank(): ChallengeQuestionConfig[] {
  if (!isBrowser()) return [];
  try {
    const managed = peekManagedQuestionBank();
    if (!managed.length) return [];
    return managed
      .filter((question) => question.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toChallengeConfig);
  } catch {
    return [];
  }
}

/**
 * Prefer locally managed active questions when present; otherwise ship config bank.
 */
export function loadQuestionBank(): ChallengeQuestionConfig[] {
  const managed = readManagedBank();
  return managed.length > 0 ? managed : QUESTION_BANK;
}


export function prepareSessionQuestions(
  bank: ChallengeQuestionConfig[] = loadQuestionBank(),
  count = QUESTIONS_PER_SESSION,
  random: () => number = Math.random,
): PreparedChallengeQuestion[] {
  const selected = pickUnique(bank, count, random);

  return selected.map((question, index) => ({
    ...question,
    options: shuffleArray(question.options, random),
    sessionOrder: index + 1,
  }));
}

export function createChallengeSession(
  options?: {
    bank?: ChallengeQuestionConfig[];
    count?: number;
    random?: () => number;
    sessionId?: string;
  },
): ChallengeSessionState {
  const startedAt = new Date().toISOString();

  return {
    sessionId: options?.sessionId ?? createId("challenge"),
    status: "in_progress",
    questions: prepareSessionQuestions(
      options?.bank ?? loadQuestionBank(),
      options?.count ?? QUESTIONS_PER_SESSION,
      options?.random ?? Math.random,
    ),
    currentIndex: 0,
    answers: [],
    dimensionScores: { ...EMPTY_DIMENSION_SCORES },
    phase: "question",
    startedAt,
  };
}
