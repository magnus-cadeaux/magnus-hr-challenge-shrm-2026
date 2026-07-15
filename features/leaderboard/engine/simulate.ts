import { SIMULATION_CONFIG } from "../config/simulation";
import { maybeCreateMoment } from "./moments";
import {
  buildCompaniesFromIndividuals,
  normalizeSignatureShares,
  rankIndividuals,
} from "./ranking";
import {
  createParticipant,
  snapshotFromRuntime,
  type ArenaRuntime,
} from "./seed";
import type { ArenaSnapshot, SignatureShare } from "./types";
import {
  chance,
  clamp,
  createId,
  pickIndex,
  randomBetween,
  roundScore,
} from "./utils";

function shiftSignatures(current: SignatureShare[]): SignatureShare[] {
  const next = current.map((item) => ({
    ...item,
    percentage: clamp(
      item.percentage + randomBetween(-1.8, 1.8),
      4,
      38,
    ),
  }));
  return normalizeSignatureShares(next);
}

function bumpScore(score: number): number {
  const delta = randomBetween(-3.5, 4.2);
  return clamp(roundScore(score + delta), 68, 99.5);
}

/**
 * Advance one mock live tick: score drift, optional join, signature shift,
 * company re-rank, and rare special moments.
 */
export function advanceArenaTick(
  runtime: ArenaRuntime,
  previous: ArenaSnapshot,
): { runtime: ArenaRuntime; snapshot: ArenaSnapshot } {
  const nextRuntime: ArenaRuntime = {
    ...runtime,
    pool: runtime.pool.map((person) => ({ ...person })),
    seenCompanies: new Set(runtime.seenCompanies),
    signatureMilestones: new Set(runtime.signatureMilestones),
  };

  // Score changes across a few participants
  const changeCount = 1 + pickIndex(3);
  for (let i = 0; i < changeCount; i += 1) {
    const index = pickIndex(nextRuntime.pool.length);
    const person = nextRuntime.pool[index];
    if (!person) continue;
    nextRuntime.pool[index] = {
      ...person,
      score: bumpScore(person.score),
    };
  }

  // Occasional new participant
  if (chance(SIMULATION_CONFIG.joinProbability)) {
    const showcaseCompanies = [
      "Oracle",
      "Wipro",
      "HCLTech",
      "Capgemini",
      "Adobe",
      "Cisco",
      "SAP",
    ].filter((name) => !nextRuntime.seenCompanies.has(name));

    if (chance(0.45) && showcaseCompanies.length > 0) {
      const company = showcaseCompanies[pickIndex(showcaseCompanies.length)]!;
      nextRuntime.pool.push(
        createParticipant({
          id: createId("person"),
          company,
          score: roundScore(88 + Math.random() * 8),
        }),
      );
    } else {
      nextRuntime.pool.push(createParticipant());
    }

    nextRuntime.rewardsCollected += chance(0.7) ? 1 : 0;
  }

  const signatures = shiftSignatures(previous.signatures);
  const individuals = rankIndividuals(
    nextRuntime.pool,
    new Map(previous.individuals.map((e) => [e.id, e.rank])),
    SIMULATION_CONFIG.topN,
  );
  const companies = buildCompaniesFromIndividuals(
    nextRuntime.pool,
    new Map(previous.companies.map((e) => [e.id, e.rank])),
    SIMULATION_CONFIG.topN,
  );

  const base = snapshotFromRuntime(
    nextRuntime,
    { ...previous, signatures },
    previous.tick + 1,
  );

  const snapshot: ArenaSnapshot = {
    ...base,
    individuals,
    companies,
    signatures,
    stats: {
      ...base.stats,
      participants: Math.max(
        previous.stats.participants + (chance(0.4) ? 1 : 0),
        nextRuntime.pool.length,
      ),
      rewardsCollected: nextRuntime.rewardsCollected,
    },
    updatedAt: Date.now(),
  };

  const now = Date.now();
  const cooldownReady =
    now - nextRuntime.lastMomentAt >= SIMULATION_CONFIG.momentCooldownMs;
  const moment =
    cooldownReady && chance(SIMULATION_CONFIG.momentProbability)
      ? maybeCreateMoment(previous, snapshot, {
          allowed: true,
          seenCompanies: nextRuntime.seenCompanies,
          signatureMilestones: nextRuntime.signatureMilestones,
        })
      : null;

  if (moment) {
    nextRuntime.lastMomentAt = now;
  }

  for (const person of nextRuntime.pool) {
    nextRuntime.seenCompanies.add(person.company);
  }

  return {
    runtime: nextRuntime,
    snapshot: { ...snapshot, moment },
  };
}

export function nextTickDelayMs(
  config = SIMULATION_CONFIG,
  random = Math.random,
): number {
  return Math.round(
    randomBetween(config.tickMinMs, config.tickMaxMs, random),
  );
}
