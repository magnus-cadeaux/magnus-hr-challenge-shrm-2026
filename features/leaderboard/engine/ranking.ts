import type {
  CompanyStanding,
  IndividualStanding,
  RankMovement,
  SignatureShare,
} from "./types";
import { movementFromRanks, roundScore } from "./utils";

interface Rankable {
  id: string;
  rank: number;
}

export function attachMovement<T extends Rankable>(
  next: T[],
  previousById: Map<string, number>,
): Array<T & { previousRank: number; movement: RankMovement }> {
  return next.map((entry) => {
    const previousRank = previousById.get(entry.id) ?? entry.rank;
    return {
      ...entry,
      previousRank,
      movement: movementFromRanks(previousRank, entry.rank),
    };
  });
}

export function rankIndividuals(
  pool: Array<Omit<IndividualStanding, "rank" | "previousRank" | "movement">>,
  previousById: Map<string, number>,
  topN: number,
): IndividualStanding[] {
  const sorted = [...pool].sort((a, b) => b.score - a.score);
  const ranked = sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
  return attachMovement(ranked, previousById).slice(0, topN);
}

export function buildCompaniesFromIndividuals(
  individuals: Array<Pick<IndividualStanding, "company" | "score">>,
  previousById: Map<string, number>,
  topN: number,
): CompanyStanding[] {
  const buckets = new Map<
    string,
    { name: string; total: number; participants: number }
  >();

  for (const person of individuals) {
    const current = buckets.get(person.company) ?? {
      name: person.company,
      total: 0,
      participants: 0,
    };
    current.total += person.score;
    current.participants += 1;
    buckets.set(person.company, current);
  }

  const ranked = Array.from(buckets.values())
    .map((bucket) => ({
      id: `company_${bucket.name.toLowerCase().replace(/\s+/g, "_")}`,
      name: bucket.name,
      averageScore: roundScore(bucket.total / bucket.participants),
      participants: bucket.participants,
      rank: 0,
    }))
    .sort((a, b) => {
      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore;
      }
      return b.participants - a.participants;
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return attachMovement(ranked, previousById).slice(0, topN);
}

export function normalizeSignatureShares(
  shares: SignatureShare[],
): SignatureShare[] {
  const total = shares.reduce((sum, item) => sum + item.percentage, 0);
  if (total <= 0) {
    const even = Math.round((100 / shares.length) * 10) / 10;
    return shares.map((item) => ({ ...item, percentage: even }));
  }

  const normalized = shares.map((item) => ({
    ...item,
    percentage: roundScore((item.percentage / total) * 100),
  }));

  const drift =
    100 - normalized.reduce((sum, item) => sum + item.percentage, 0);
  if (normalized[0]) {
    normalized[0] = {
      ...normalized[0],
      percentage: roundScore(normalized[0].percentage + drift),
    };
  }

  return [...normalized].sort((a, b) => b.percentage - a.percentage);
}
