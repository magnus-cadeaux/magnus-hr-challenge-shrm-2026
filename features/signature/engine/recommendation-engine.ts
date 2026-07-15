import { RECOMMENDATION_CATALOG } from "../config/recommendations";
import type {
  RecommendationDefinition,
  SignatureDefinition,
  SignatureId,
} from "./types";

export function selectRecommendations(
  primary: SignatureDefinition,
  secondary: SignatureDefinition,
  catalog: RecommendationDefinition[] = RECOMMENDATION_CATALOG,
  limit = 3,
): RecommendationDefinition[] {
  const prioritizedIds: SignatureId[] = [primary.id, secondary.id];

  const scored = catalog
    .map((item) => {
      let score = 0;
      if (item.signatureIds.includes(primary.id)) score += 3;
      if (item.signatureIds.includes(secondary.id)) score += 2;
      if (item.dimension === primary.dimension) score += 1.5;
      if (item.dimension === secondary.dimension) score += 1;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected: RecommendationDefinition[] = [];
  for (const entry of scored) {
    if (selected.length >= limit) break;
    if (selected.some((item) => item.id === entry.item.id)) continue;
    selected.push(entry.item);
  }

  if (selected.length < limit) {
    for (const item of catalog) {
      if (selected.length >= limit) break;
      if (selected.some((entry) => entry.id === item.id)) continue;
      if (item.signatureIds.some((id) => prioritizedIds.includes(id))) {
        selected.push(item);
      }
    }
  }

  return selected.slice(0, limit);
}
