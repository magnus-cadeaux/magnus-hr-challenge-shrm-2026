export const SIGNATURE_DIMENSIONS = [
  "innovation",
  "culture",
  "execution",
  "empathy",
  "sustainability",
  "recognition",
] as const;

export type SignatureDimension = (typeof SIGNATURE_DIMENSIONS)[number];

export type DimensionScores = Record<SignatureDimension, number>;

export const EMPTY_DIMENSION_SCORES: DimensionScores = {
  innovation: 0,
  culture: 0,
  execution: 0,
  empathy: 0,
  sustainability: 0,
  recognition: 0,
};

export type DimensionImpact = Partial<Record<SignatureDimension, number>>;

export const CHALLENGE_CATEGORIES = [
  "employee_experience",
  "recognition",
  "corporate_gifting",
  "sustainability",
  "vendor_management",
  "future_of_hr",
] as const;

export type ChallengeCategoryId = (typeof CHALLENGE_CATEGORIES)[number];

export const CHALLENGE_CATEGORY_LABELS: Record<ChallengeCategoryId, string> = {
  employee_experience: "Employee Experience",
  recognition: "Recognition",
  corporate_gifting: "Corporate Gifting",
  sustainability: "Sustainability",
  vendor_management: "Vendor Management",
  future_of_hr: "Future of HR",
};

export const QUESTION_TYPES = [
  "multiple_choice",
  "true_false",
  "opinion",
  "priority_ranking",
  "image_choice",
  "opinion_scale",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  true_false: "True / False",
  opinion: "Opinion",
  priority_ranking: "Ranking",
  image_choice: "Image Choice",
  opinion_scale: "Scale",
};

export type ChallengeOptionConfig = {
  id: string;
  label: string;
  /** Optional image asset path for image_choice questions. */
  imageSrc?: string;
  impacts: DimensionImpact;
};

type ChallengeQuestionBase = {
  id: string;
  category: ChallengeCategoryId;
  prompt: string;
  /** Shown after answering (participant insight / explanation). */
  insight: string;
  options: ChallengeOptionConfig[];
};

export type MultipleChoiceQuestion = ChallengeQuestionBase & {
  type: "multiple_choice";
};

export type TrueFalseQuestion = ChallengeQuestionBase & {
  type: "true_false";
};

export type OpinionQuestion = ChallengeQuestionBase & {
  type: "opinion";
};

export type PriorityRankingQuestion = ChallengeQuestionBase & {
  type: "priority_ranking";
};

export type ImageChoiceQuestion = ChallengeQuestionBase & {
  type: "image_choice";
};

export type OpinionScaleQuestion = ChallengeQuestionBase & {
  type: "opinion_scale";
};

export type ChallengeQuestionConfig =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OpinionQuestion
  | PriorityRankingQuestion
  | ImageChoiceQuestion
  | OpinionScaleQuestion;

/** Runtime question instance after option shuffling / session prep. */
export type PreparedChallengeQuestion = ChallengeQuestionConfig & {
  sessionOrder: number;
};

export type ChallengeAnswerRecord = {
  questionId: string;
  /** Selected option id(s). Ranking stores ordered ids. */
  optionIds: string[];
  answeredAt: string;
  impacts: DimensionImpact;
};

export type ChallengePhase = "question" | "insight" | "complete";

export type ChallengeSessionState = {
  sessionId: string;
  status: "in_progress" | "completed";
  questions: PreparedChallengeQuestion[];
  currentIndex: number;
  answers: ChallengeAnswerRecord[];
  dimensionScores: DimensionScores;
  phase: ChallengePhase;
  startedAt: string;
  completedAt?: string;
  /** Total leaderboard score — set when status becomes completed. */
  score?: number;
  lastInsight?: string;
  lastAnswerOptionIds?: string[];
};

export const QUESTIONS_PER_SESSION = 6;
export const INSIGHT_DISPLAY_MS = 2000;
