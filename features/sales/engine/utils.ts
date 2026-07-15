import type { ProfileScores } from "@/features/signature/engine/types";
import type { SignatureId } from "@/features/signature/engine/types";

export function averageScore(scores: ProfileScores): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function dimensionContribution(
  scores: ProfileScores,
  dimensions: Array<keyof ProfileScores>,
): number {
  if (dimensions.length === 0) return 0;
  return (
    dimensions.reduce((sum, key) => sum + (scores[key] ?? 0), 0) /
    dimensions.length
  );
}

export function signatureBoost(
  primaryId: SignatureId,
  secondaryId: SignatureId,
  signatureIds: SignatureId[],
): number {
  let boost = 0;
  if (signatureIds.includes(primaryId)) boost += 28;
  if (signatureIds.includes(secondaryId)) boost += 16;
  return boost;
}

export function clampScore(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function topN<T extends { score: number }>(items: T[], count: number): T[] {
  return [...items].sort((a, b) => b.score - a.score).slice(0, count);
}
