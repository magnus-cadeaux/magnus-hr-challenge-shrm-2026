import type { DimensionImpact, DimensionScores } from "./types";
import { EMPTY_DIMENSION_SCORES } from "./types";

export function mergeImpacts(
  current: DimensionScores,
  impacts: DimensionImpact,
): DimensionScores {
  const next = { ...current };
  for (const [key, value] of Object.entries(impacts)) {
    if (value == null) continue;
    const dimension = key as keyof DimensionScores;
    next[dimension] = (next[dimension] ?? 0) + value;
  }
  return next;
}

export function sumImpacts(impactsList: DimensionImpact[]): DimensionScores {
  return impactsList.reduce<DimensionScores>(
    (scores, impacts) => mergeImpacts(scores, impacts),
    { ...EMPTY_DIMENSION_SCORES },
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Sum of six dimension scores + speed bonus for faster completions. */
export function computeChallengeScore(
  dimensionScores: DimensionScores,
  elapsedMs: number,
): number {
  const dimensionTotal = Object.values(dimensionScores).reduce(
    (sum, value) => sum + (Number.isFinite(value) ? value : 0),
    0,
  );
  const elapsedSeconds = Math.max(0, elapsedMs) / 1000;
  const speedBonus = clamp(60 - elapsedSeconds, 0, 30);
  return Math.round((dimensionTotal + speedBonus) * 100) / 100;
}
