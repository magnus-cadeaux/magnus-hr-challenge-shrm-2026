import { DEFAULT_INSIGHT, INSIGHT_TEMPLATES } from "../config/insights";
import type { InsightTemplate, SignatureDefinition, SignatureId } from "./types";

export function resolveExecutiveInsight(
  primary: SignatureDefinition,
  secondary: SignatureDefinition,
  templates: InsightTemplate[] = INSIGHT_TEMPLATES,
): string {
  const exact = templates.find(
    (template) =>
      template.primaryId === primary.id &&
      template.secondaryId === secondary.id,
  );
  if (exact) return exact.copy;

  const primaryMatch = templates.find(
    (template) => template.primaryId === primary.id,
  );
  if (primaryMatch) return primaryMatch.copy;

  const reverse = templates.find(
    (template) =>
      template.primaryId === secondary.id &&
      template.secondaryId === primary.id,
  );
  if (reverse) return reverse.copy;

  const byIds = new Set<SignatureId>([primary.id, secondary.id]);
  const loose = templates.find(
    (template) =>
      byIds.has(template.primaryId) ||
      (template.secondaryId ? byIds.has(template.secondaryId) : false),
  );

  return loose?.copy ?? DEFAULT_INSIGHT;
}
