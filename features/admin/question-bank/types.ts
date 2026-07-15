import type {
  ChallengeCategoryId,
  ChallengeOptionConfig,
  ChallengeQuestionConfig,
  DimensionImpact,
  QuestionType,
  SignatureDimension,
} from "@/features/challenge/engine/types";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionStats = {
  timesAsked: number;
  /** Placeholder until analytics wiring — null means unknown. */
  correctnessPercent: number | null;
  averageResponseMs: number | null;
};

/**
 * Admin-managed question record.
 * Local now; schema mirrors a future `questions` Supabase table.
 */
export type ManagedQuestion = {
  id: string;
  type: QuestionType;
  category: ChallengeCategoryId;
  prompt: string;
  /** Explanation / insight shown after answering. */
  insight: string;
  options: ChallengeOptionConfig[];
  /** Primary scoring / “correct” option ids where applicable. */
  correctOptionIds: string[];
  active: boolean;
  sortOrder: number;
  difficulty: QuestionDifficulty;
  tags: string[];
  stats: QuestionStats;
  createdAt: string;
  updatedAt: string;
};

export type ManagedQuestionDraft = Omit<
  ManagedQuestion,
  "id" | "createdAt" | "updatedAt" | "stats" | "sortOrder"
> & {
  id?: string;
  sortOrder?: number;
  stats?: QuestionStats;
};

export type QuestionBankFilters = {
  search: string;
  category: ChallengeCategoryId | "all";
  type: QuestionType | "all";
  status: "all" | "active" | "inactive";
};

export const EMPTY_STATS: QuestionStats = {
  timesAsked: 0,
  correctnessPercent: null,
  averageResponseMs: null,
};

export const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export type QuestionBankProvider = {
  list(): Promise<ManagedQuestion[]>;
  get(id: string): Promise<ManagedQuestion | null>;
  upsert(question: ManagedQuestion): Promise<ManagedQuestion>;
  remove(id: string): Promise<void>;
  replaceAll(questions: ManagedQuestion[]): Promise<void>;
  reorder(orderedIds: string[]): Promise<ManagedQuestion[]>;
};

export function toChallengeConfig(
  question: ManagedQuestion,
): ChallengeQuestionConfig {
  return {
    id: question.id,
    type: question.type,
    category: question.category,
    prompt: question.prompt,
    insight: question.insight,
    options: question.options,
  } as ChallengeQuestionConfig;
}

export function createEmptyOption(
  prefix: string,
  index: number,
): ChallengeOptionConfig {
  return {
    id: `${prefix}-opt-${index + 1}`,
    label: "",
    impacts: {},
  };
}

export function createBlankQuestion(
  type: QuestionType = "multiple_choice",
  sortOrder = 0,
): ManagedQuestion {
  const now = new Date().toISOString();
  const id = `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const options =
    type === "true_false"
      ? [
          { id: `${id}-true`, label: "True", impacts: {} as DimensionImpact },
          { id: `${id}-false`, label: "False", impacts: {} as DimensionImpact },
        ]
      : [
          createEmptyOption(id, 0),
          createEmptyOption(id, 1),
          createEmptyOption(id, 2),
          createEmptyOption(id, 3),
        ];

  return {
    id,
    type,
    category: "employee_experience",
    prompt: "",
    insight: "",
    options,
    correctOptionIds: [],
    active: true,
    sortOrder,
    difficulty: "medium",
    tags: [],
    stats: { ...EMPTY_STATS },
    createdAt: now,
    updatedAt: now,
  };
}

export function duplicateManagedQuestion(
  source: ManagedQuestion,
  sortOrder: number,
): ManagedQuestion {
  const now = new Date().toISOString();
  const id = `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    ...source,
    id,
    prompt: `${source.prompt} (copy)`.trim(),
    options: source.options.map((option, index) => ({
      ...option,
      id: `${id}-opt-${index + 1}`,
      impacts: { ...option.impacts },
    })),
    correctOptionIds: [],
    sortOrder,
    stats: { ...EMPTY_STATS },
    createdAt: now,
    updatedAt: now,
  };
}

export type WeightCell = {
  dimension: SignatureDimension;
  value: number;
};
