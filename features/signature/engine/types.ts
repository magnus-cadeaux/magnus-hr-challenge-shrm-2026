import type { DimensionScores as ChallengeDimensionScores } from "@/features/challenge/engine/types";

export const PROFILE_DIMENSIONS = [
  "innovation",
  "culture",
  "sustainability",
  "execution",
  "experience",
  "strategy",
  "connection",
  "growth",
] as const;

export type ProfileDimension = (typeof PROFILE_DIMENSIONS)[number];

export type ProfileScores = Record<ProfileDimension, number>;

export const EMPTY_PROFILE_SCORES: ProfileScores = {
  innovation: 0,
  culture: 0,
  sustainability: 0,
  execution: 0,
  experience: 0,
  strategy: 0,
  connection: 0,
  growth: 0,
};

export const PROFILE_DIMENSION_LABELS: Record<ProfileDimension, string> = {
  innovation: "Innovation",
  culture: "Culture",
  sustainability: "Sustainability",
  execution: "Execution",
  experience: "Employee Experience",
  strategy: "Strategy",
  connection: "Connection",
  growth: "Growth",
};

export type SignatureId =
  | "innovation_catalyst"
  | "culture_builder"
  | "sustainable_strategist"
  | "experience_curator"
  | "execution_expert"
  | "growth_enabler"
  | "people_connector"
  | "strategic_planner";

export type SignatureDefinition = {
  id: SignatureId;
  name: string;
  dimension: ProfileDimension;
  summary: string;
};

export type RecommendationDefinition = {
  id: string;
  title: string;
  signatureIds: SignatureId[];
  dimension?: ProfileDimension;
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  /** Match when this dimension is among top N */
  dimension?: ProfileDimension;
  /** Match when average decision time heuristic or answer count */
  rule?: "fast_decisions" | "balanced_profile" | "top_dimension";
};

export type InsightTemplate = {
  id: string;
  primaryId: SignatureId;
  secondaryId?: SignatureId;
  copy: string;
};

export type SignatureProfileResult = {
  sessionId: string;
  displayName: string;
  organization: string;
  scores: ProfileScores;
  normalizedScores: ProfileScores;
  primary: SignatureDefinition;
  secondary: SignatureDefinition;
  insight: string;
  recommendations: RecommendationDefinition[];
  achievements: AchievementDefinition[];
  percentile: number;
  challengeScores: ChallengeDimensionScores;
};
