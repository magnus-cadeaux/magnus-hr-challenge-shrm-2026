import type { DimensionScores as ChallengeDimensionScores } from "@/features/challenge/engine/types";
import { CHALLENGE_TO_PROFILE_WEIGHTS } from "../config/dimension-map";
import {
  EMPTY_PROFILE_SCORES,
  PROFILE_DIMENSIONS,
  type ProfileScores,
} from "./types";

export function mapChallengeScoresToProfile(
  challengeScores: ChallengeDimensionScores,
): ProfileScores {
  const scores: ProfileScores = { ...EMPTY_PROFILE_SCORES };

  for (const [challengeKey, value] of Object.entries(challengeScores)) {
    const weights =
      CHALLENGE_TO_PROFILE_WEIGHTS[
        challengeKey as keyof typeof CHALLENGE_TO_PROFILE_WEIGHTS
      ];
    if (!weights) continue;

    for (const [profileKey, weight] of Object.entries(weights)) {
      if (weight == null) continue;
      const axis = profileKey as keyof ProfileScores;
      scores[axis] += value * weight;
    }
  }

  return scores;
}

export function normalizeProfileScores(scores: ProfileScores): ProfileScores {
  const values = PROFILE_DIMENSIONS.map((key) => scores[key]);
  const max = Math.max(...values, 1);

  return PROFILE_DIMENSIONS.reduce((acc, key) => {
    acc[key] = Number(((scores[key] / max) * 100).toFixed(1));
    return acc;
  }, { ...EMPTY_PROFILE_SCORES });
}

export function rankProfileDimensions(scores: ProfileScores) {
  return [...PROFILE_DIMENSIONS].sort((a, b) => scores[b] - scores[a]);
}
