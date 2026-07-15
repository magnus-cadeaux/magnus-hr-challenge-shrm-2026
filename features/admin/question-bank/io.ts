import {
  CHALLENGE_CATEGORIES,
  QUESTION_TYPES,
  SIGNATURE_DIMENSIONS,
  type ChallengeCategoryId,
  type ChallengeOptionConfig,
  type QuestionType,
  type SignatureDimension,
} from "@/features/challenge/engine/types";
import {
  EMPTY_STATS,
  type ManagedQuestion,
  type QuestionDifficulty,
  type QuestionBankFilters,
} from "./types";

export function filterQuestions(
  questions: ManagedQuestion[],
  filters: QuestionBankFilters,
): ManagedQuestion[] {
  const query = filters.search.trim().toLowerCase();

  return questions.filter((question) => {
    if (filters.category !== "all" && question.category !== filters.category) {
      return false;
    }
    if (filters.type !== "all" && question.type !== filters.type) {
      return false;
    }
    if (filters.status === "active" && !question.active) return false;
    if (filters.status === "inactive" && question.active) return false;
    if (!query) return true;

    const haystack = [
      question.prompt,
      question.insight,
      question.id,
      ...question.tags,
      ...question.options.map((option) => option.label),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function questionsToJson(questions: ManagedQuestion[]): string {
  return JSON.stringify(questions, null, 2);
}

export function questionsFromJson(raw: string): ManagedQuestion[] {
  const parsed = JSON.parse(raw) as unknown;

  let list: unknown = parsed;
  if (!Array.isArray(list) && parsed && typeof parsed === "object") {
    const record = parsed as Record<string, unknown>;
    if (Array.isArray(record.questions)) list = record.questions;
    else if (Array.isArray(record.items)) list = record.items;
    else if (Array.isArray(record.data)) list = record.data;
  }

  if (!Array.isArray(list)) {
    throw new Error(
      "JSON must be an array of questions (or { questions: [...] })",
    );
  }

  const normalized = list.map((item, index) =>
    normalizeImportedQuestion(item, index),
  );

  // Prefer last occurrence when duplicate ids appear in the file.
  const byId = new Map<string, ManagedQuestion>();
  for (const question of normalized) {
    byId.set(question.id, question);
  }
  return Array.from(byId.values()).map((question, index) => ({
    ...question,
    sortOrder: index,
  }));
}

export function questionsToCsv(questions: ManagedQuestion[]): string {
  const headers = [
    "id",
    "type",
    "category",
    "prompt",
    "insight",
    "active",
    "sortOrder",
    "difficulty",
    "tags",
    "correctOptionIds",
    "options",
  ];

  const escape = (value: string) => {
    if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
    return value;
  };

  const rows = questions.map((question) =>
    [
      question.id,
      question.type,
      question.category,
      question.prompt,
      question.insight,
      String(question.active),
      String(question.sortOrder),
      question.difficulty,
      question.tags.join("|"),
      question.correctOptionIds.join("|"),
      JSON.stringify(question.options),
    ]
      .map((cell) => escape(String(cell)))
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]!;
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

export function questionsFromCsv(raw: string): ManagedQuestion[] {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]!).map((header) => header.trim());
  const indexOf = (name: string) => headers.indexOf(name);

  return lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line);
    const get = (name: string) => cells[indexOf(name)] ?? "";

    let options: ChallengeOptionConfig[] = [];
    try {
      options = JSON.parse(get("options") || "[]") as ChallengeOptionConfig[];
    } catch {
      options = [];
    }

    return normalizeImportedQuestion(
      {
        id: get("id"),
        type: get("type"),
        category: get("category"),
        prompt: get("prompt"),
        insight: get("insight"),
        active: get("active"),
        sortOrder: get("sortOrder") || index,
        difficulty: get("difficulty"),
        tags: get("tags"),
        correctOptionIds: get("correctOptionIds"),
        options,
      },
      index,
    );
  });
}

function normalizeImportedQuestion(
  raw: unknown,
  index: number,
): ManagedQuestion {
  const item = (raw ?? {}) as Record<string, unknown>;
  const now = new Date().toISOString();
  const type = (
    QUESTION_TYPES.includes(item.type as QuestionType)
      ? item.type
      : "multiple_choice"
  ) as QuestionType;
  const category = (
    CHALLENGE_CATEGORIES.includes(item.category as ChallengeCategoryId)
      ? item.category
      : "employee_experience"
  ) as ChallengeCategoryId;
  const difficulty = (
    ["easy", "medium", "hard"].includes(String(item.difficulty))
      ? item.difficulty
      : "medium"
  ) as QuestionDifficulty;

  const tags = Array.isArray(item.tags)
    ? item.tags.map(String)
    : String(item.tags ?? "")
        .split("|")
        .map((tag) => tag.trim())
        .filter(Boolean);

  const correctOptionIds = Array.isArray(item.correctOptionIds)
    ? item.correctOptionIds.map(String)
    : String(item.correctOptionIds ?? "")
        .split("|")
        .map((id) => id.trim())
        .filter(Boolean);

  const options = Array.isArray(item.options)
    ? (item.options as ChallengeOptionConfig[]).map((option, optIndex) => ({
        id: option.id || `opt-${index}-${optIndex}`,
        label: option.label ?? "",
        imageSrc: option.imageSrc,
        impacts: sanitizeImpacts(option.impacts ?? {}),
      }))
    : [];

  return {
    id: String(item.id || `q_import_${index + 1}`),
    type,
    category,
    prompt: String(item.prompt ?? ""),
    insight: String(item.insight ?? item.explanation ?? ""),
    options,
    correctOptionIds,
    active: item.active === false || item.active === "false" ? false : true,
    sortOrder: Number(item.sortOrder ?? index),
    difficulty,
    tags,
    stats: {
      ...EMPTY_STATS,
      ...(typeof item.stats === "object" && item.stats
        ? (item.stats as ManagedQuestion["stats"])
        : {}),
    },
    createdAt: String(item.createdAt ?? now),
    updatedAt: String(item.updatedAt ?? now),
  };
}

function sanitizeImpacts(
  impacts: Record<string, number>,
): Partial<Record<SignatureDimension, number>> {
  const next: Partial<Record<SignatureDimension, number>> = {};
  for (const dimension of SIGNATURE_DIMENSIONS) {
    const value = impacts[dimension];
    if (typeof value === "number" && Number.isFinite(value)) {
      next[dimension] = value;
    }
  }
  return next;
}

export function downloadTextFile(
  filename: string,
  contents: string,
  mime: string,
): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
