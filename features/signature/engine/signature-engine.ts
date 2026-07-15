import { SIGNATURE_DEFINITIONS } from "../config/signatures";
import type { ProfileScores, SignatureDefinition } from "./types";
import { rankProfileDimensions } from "./profile-mapper";

export function resolveSignatures(
  scores: ProfileScores,
  definitions: SignatureDefinition[] = SIGNATURE_DEFINITIONS,
): { primary: SignatureDefinition; secondary: SignatureDefinition } {
  const rankedDimensions = rankProfileDimensions(scores);

  const byDimension = new Map(
    definitions.map((definition) => [definition.dimension, definition]),
  );

  const ordered = rankedDimensions
    .map((dimension) => byDimension.get(dimension))
    .filter(Boolean) as SignatureDefinition[];

  const primary = ordered[0] ?? definitions[0];
  const secondary =
    ordered.find((item) => item.id !== primary.id) ??
    definitions.find((item) => item.id !== primary.id) ??
    definitions[1] ??
    primary;

  return { primary, secondary };
}
