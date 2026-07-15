import type { SignatureDimension as ChallengeDimension } from "@/features/challenge/engine/types";
import type { ProfileDimension } from "../engine/types";

/**
 * Weighted map from challenge (Sprint 4) dimensions → profile radar axes.
 * Adjust here without touching UI or scoring calculations.
 */
export const CHALLENGE_TO_PROFILE_WEIGHTS: Record<
  ChallengeDimension,
  Partial<Record<ProfileDimension, number>>
> = {
  innovation: {
    innovation: 1,
    strategy: 0.35,
    growth: 0.25,
  },
  culture: {
    culture: 1,
    connection: 0.4,
    experience: 0.2,
  },
  execution: {
    execution: 1,
    strategy: 0.3,
    growth: 0.15,
  },
  empathy: {
    experience: 1,
    connection: 0.55,
    culture: 0.2,
  },
  sustainability: {
    sustainability: 1,
    strategy: 0.25,
    growth: 0.15,
  },
  recognition: {
    connection: 0.65,
    experience: 0.55,
    culture: 0.35,
  },
};
