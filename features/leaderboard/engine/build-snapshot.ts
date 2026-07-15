import {
  buildCompaniesFromIndividuals,
  normalizeSignatureShares,
  rankIndividuals,
} from "./ranking";
import type { LeaderboardStandingRow } from "./local-standings";
import type {
  ArenaSnapshot,
  ArenaStats,
  IndividualStanding,
  SignatureShare,
} from "./types";
import { roundScore } from "./utils";

const REAL_TOP_N = 50;

function poolFromRows(
  rows: LeaderboardStandingRow[],
): Array<Omit<IndividualStanding, "rank" | "previousRank" | "movement">> {
  return rows.map((row) => ({
    id: row.localSessionId || row.id,
    name: row.displayName,
    company: row.companyName,
    score: row.score,
    signatureId: row.signatureId,
    signatureName: row.signatureName,
  }));
}

function buildSignatureShares(
  pool: Array<Pick<IndividualStanding, "signatureId" | "signatureName">>,
): SignatureShare[] {
  if (pool.length === 0) return [];

  const counts = new Map<string, { id: string; name: string; count: number }>();
  for (const person of pool) {
    const key = person.signatureId || person.signatureName;
    const current = counts.get(key) ?? {
      id: person.signatureId || key,
      name: person.signatureName || "—",
      count: 0,
    };
    current.count += 1;
    counts.set(key, current);
  }

  const raw = Array.from(counts.values()).map((item) => ({
    id: item.id,
    name: item.name,
    percentage: (item.count / pool.length) * 100,
  }));

  return normalizeSignatureShares(raw);
}

function computeRealStats(
  pool: Array<Pick<IndividualStanding, "score" | "company">>,
  signatures: SignatureShare[],
): ArenaStats {
  const averageScore =
    pool.length === 0
      ? 0
      : roundScore(pool.reduce((sum, p) => sum + p.score, 0) / pool.length);

  return {
    participants: pool.length,
    averageScore,
    rewardsCollected: pool.length,
    companiesRepresented: new Set(pool.map((p) => p.company)).size,
    mostPopularSignature: signatures[0]?.name ?? "—",
  };
}

/** Map leaderboard rows into the ArenaSnapshot shape the UI already consumes. */
export function buildArenaSnapshotFromStandings(
  rows: LeaderboardStandingRow[],
  previous: ArenaSnapshot | null = null,
): ArenaSnapshot {
  const pool = poolFromRows(rows);
  const prevIndividualRanks = new Map(
    (previous?.individuals ?? []).map((entry) => [entry.id, entry.rank]),
  );
  const prevCompanyRanks = new Map(
    (previous?.companies ?? []).map((entry) => [entry.id, entry.rank]),
  );

  const individuals = rankIndividuals(pool, prevIndividualRanks, REAL_TOP_N);
  const companies = buildCompaniesFromIndividuals(
    pool,
    prevCompanyRanks,
    REAL_TOP_N,
  );
  const signatures = buildSignatureShares(pool);

  return {
    individuals,
    companies,
    signatures,
    stats: computeRealStats(pool, signatures),
    moment: null,
    tick: (previous?.tick ?? 0) + 1,
    updatedAt: Date.now(),
  };
}

export function emptyArenaSnapshot(): ArenaSnapshot {
  return {
    individuals: [],
    companies: [],
    signatures: [],
    stats: {
      participants: 0,
      averageScore: 0,
      rewardsCollected: 0,
      companiesRepresented: 0,
      mostPopularSignature: "—",
    },
    moment: null,
    tick: 0,
    updatedAt: Date.now(),
  };
}
