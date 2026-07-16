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
      // image_choice has no real assets for tonight — never enter the session pool
      .filter(
        (question) => question.active && question.type !== "image_choice",
      )
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toChallengeConfig);
  } catch {
    return [];
  }
}

/**
 * Prefer locally managed active questions when present; otherwise ship config bank.
 * image_choice is always excluded (broken/missing visuals).
 */
export function loadQuestionBank(): ChallengeQuestionConfig[] {
  const managed = readManagedBank();
  const bank = managed.length > 0 ? managed : QUESTION_BANK;
  return bank.filter((question) => question.type !== "image_choice");
}

function prepareOptions(
  question: ChallengeQuestionConfig,
  random: () => number,
) {
  // Scale options are ordered meaning (1→5) — never shuffle.
  if (question.type === "opinion_scale") {
    return question.options;
  }
  return shuffleArray(question.options, random);
}

export function prepareSessionQuestions(
  bank: ChallengeQuestionConfig[] = loadQuestionBank(),
  count = QUESTIONS_PER_SESSION,
  random: () => number = Math.random,
): PreparedChallengeQuestion[] {
  const selected = pickUnique(bank, count, random);

  return selected.map((question, index) => ({
    ...question,
    options: prepareOptions(question, random),
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
