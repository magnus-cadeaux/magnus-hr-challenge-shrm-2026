import type { RankMovement } from "./types";

export function movementFromRanks(
  previousRank: number,
  rank: number,
): RankMovement {
  if (previousRank === 0 || previousRank === rank) return "same";
  if (rank < previousRank) return "up";
  return "down";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

export function pickIndex(length: number, random = Math.random): number {
  return Math.floor(random() * length);
}

export function randomBetween(
  min: number,
  max: number,
  random = Math.random,
): number {
  return min + random() * (max - min);
}

export function chance(probability: number, random = Math.random): boolean {
  return random() < probability;
}

/** Deterministic-ish id for mock entities (client-only). */
export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
