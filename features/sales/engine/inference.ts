import {
  BUYING_INTEREST_CATALOG,
  PAIN_POINT_CATALOG,
  PRIORITY_CATALOG,
  PRODUCT_CATALOG,
} from "../config/catalogs";
import type {
  BuyingInterestId,
  MagnusProductId,
  OrganisationMaturity,
  PainPointId,
  ScoredItem,
} from "./types";
import type { SignatureProfileResult } from "@/features/signature/engine/types";
import {
  clampScore,
  dimensionContribution,
  signatureBoost,
  topN,
} from "./utils";

export function resolveLikelyPriorities(
  signature: SignatureProfileResult,
  limit = 5,
): ScoredItem[] {
  const scored = PRIORITY_CATALOG.map((rule) => {
    const dimScore = dimensionContribution(
      signature.normalizedScores,
      rule.dimensions,
    );
    const boost = signatureBoost(
      signature.primary.id,
      signature.secondary.id,
      rule.signatureIds,
    );
    const score = clampScore(dimScore * rule.weight * 0.7 + boost * rule.weight);
    const reasons: string[] = [];
    if (boost > 0) reasons.push("Aligned to HR Signature");
    if (dimScore >= 55) reasons.push("Strong related dimension scores");
    return {
      id: rule.id,
      label: rule.label,
      score,
      reasons,
    };
  });

  return topN(scored, limit);
}

export function resolveBuyingInterests(
  signature: SignatureProfileResult,
  maturity: OrganisationMaturity,
  limit = 5,
): ScoredItem<BuyingInterestId>[] {
  const scored = BUYING_INTEREST_CATALOG.map((rule) => {
    const dimScore = dimensionContribution(
      signature.normalizedScores,
      rule.dimensions,
    );
    const boost = signatureBoost(
      signature.primary.id,
      signature.secondary.id,
      rule.signatureIds,
    );
    const maturityBonus =
      rule.maturityBoost?.includes(maturity) ? 12 : 0;
    const score = clampScore(
      dimScore * rule.weight * 0.65 + boost * rule.weight + maturityBonus,
    );
    const reasons: string[] = [];
    if (boost > 0) reasons.push("Signature fit");
    if (maturityBonus > 0) reasons.push(`Fits ${maturity} organisations`);
    return {
      id: rule.id,
      label: rule.label,
      score,
      reasons,
    };
  });

  return topN(scored, limit);
}

export function resolvePainPoints(
  signature: SignatureProfileResult,
  limit = 5,
): ScoredItem<PainPointId>[] {
  const scored = PAIN_POINT_CATALOG.map((rule) => {
    const dimScore = dimensionContribution(
      signature.normalizedScores,
      rule.dimensions,
    );
    const boost = signatureBoost(
      signature.primary.id,
      signature.secondary.id,
      rule.signatureIds,
    );
    const score = clampScore(dimScore * rule.weight * 0.7 + boost * rule.weight);
    const reasons: string[] = [];
    if (boost > 0) reasons.push("Inferred from Signature");
    if (dimScore >= 60) reasons.push("Elevated dimension pressure");
    return {
      id: rule.id,
      label: rule.label,
      score,
      reasons,
    };
  });

  return topN(scored, limit);
}

export function resolveRecommendedProducts(
  signature: SignatureProfileResult,
  interests: ScoredItem<BuyingInterestId>[],
  painPoints: ScoredItem<PainPointId>[],
  limit = 5,
): ScoredItem<MagnusProductId>[] {
  const interestIds = new Set(interests.map((item) => item.id));
  const painIds = new Set(painPoints.map((item) => item.id));

  const scored = PRODUCT_CATALOG.map((rule) => {
    const boost = signatureBoost(
      signature.primary.id,
      signature.secondary.id,
      rule.signatureIds,
    );
    const interestHits = rule.interestIds.filter((id) => interestIds.has(id))
      .length;
    const painHits = rule.painPointIds.filter((id) => painIds.has(id)).length;
    const score = clampScore(
      boost * rule.weight + interestHits * 14 * rule.weight + painHits * 12 * rule.weight,
    );
    const reasons: string[] = [];
    if (boost > 0) reasons.push("Signature alignment");
    if (interestHits > 0) reasons.push("Matches buying interests");
    if (painHits > 0) reasons.push("Addresses inferred pain points");
    return {
      id: rule.id,
      label: rule.label,
      score,
      reasons,
      opening: rule.opening,
    };
  });

  return topN(scored, limit);
}
