import {
  INITIAL_PARTICIPANT_COUNT,
  INITIAL_REWARDS_COLLECTED,
  MOCK_COMPANIES,
  MOCK_FIRST_NAMES,
  MOCK_LAST_NAMES,
  SIGNATURE_CATALOG,
} from "../config";
import { SIMULATION_CONFIG } from "../config/simulation";
import {
  buildCompaniesFromIndividuals,
  normalizeSignatureShares,
  rankIndividuals,
} from "./ranking";
import type {
  ArenaSnapshot,
  ArenaStats,
  IndividualStanding,
  SignatureShare,
} from "./types";
import { createId, pickIndex, roundScore } from "./utils";

type PoolPerson = Omit<
  IndividualStanding,
  "rank" | "previousRank" | "movement"
>;

/** Fixed opening cast — stable for SSR/hydration, then simulation mutates. */
const OPENING_CAST: PoolPerson[] = [
  {
    id: "person_seed_01",
    name: "Aanya Sharma",
    company: "Google",
    score: 94.2,
    signatureId: "innovation_catalyst",
    signatureName: "Innovation Catalyst",
  },
  {
    id: "person_seed_02",
    name: "Rohan Mehta",
    company: "IBM",
    score: 93.1,
    signatureId: "execution_expert",
    signatureName: "Execution Expert",
  },
  {
    id: "person_seed_03",
    name: "Priya Reddy",
    company: "Microsoft",
    score: 91.8,
    signatureId: "culture_builder",
    signatureName: "Culture Builder",
  },
  {
    id: "person_seed_04",
    name: "Arjun Patel",
    company: "Infosys",
    score: 90.4,
    signatureId: "strategic_planner",
    signatureName: "Strategic Planner",
  },
  {
    id: "person_seed_05",
    name: "Meera Iyer",
    company: "Salesforce",
    score: 89.6,
    signatureId: "experience_curator",
    signatureName: "Experience Curator",
  },
  {
    id: "person_seed_06",
    name: "Kabir Nair",
    company: "Qualcomm",
    score: 88.2,
    signatureId: "growth_enabler",
    signatureName: "Growth Enabler",
  },
  {
    id: "person_seed_07",
    name: "Anika Das",
    company: "ServiceNow",
    score: 87.5,
    signatureId: "people_connector",
    signatureName: "People Connector",
  },
  {
    id: "person_seed_08",
    name: "Dev Kapoor",
    company: "Micron",
    score: 86.9,
    signatureId: "sustainable_strategist",
    signatureName: "Sustainable Strategist",
  },
  {
    id: "person_seed_09",
    name: "Sara Khan",
    company: "Apple",
    score: 86.1,
    signatureId: "innovation_catalyst",
    signatureName: "Innovation Catalyst",
  },
  {
    id: "person_seed_10",
    name: "Vikram Rao",
    company: "Amgen",
    score: 85.4,
    signatureId: "culture_builder",
    signatureName: "Culture Builder",
  },
  {
    id: "person_seed_11",
    name: "Nisha Banerjee",
    company: "Eli Lilly",
    score: 84.8,
    signatureId: "execution_expert",
    signatureName: "Execution Expert",
  },
  {
    id: "person_seed_12",
    name: "Ishaan Chen",
    company: "Carelon",
    score: 83.7,
    signatureId: "growth_enabler",
    signatureName: "Growth Enabler",
  },
  {
    id: "person_seed_13",
    name: "Leila Park",
    company: "Deloitte",
    score: 82.9,
    signatureId: "strategic_planner",
    signatureName: "Strategic Planner",
  },
  {
    id: "person_seed_14",
    name: "Omar Williams",
    company: "TCS",
    score: 81.6,
    signatureId: "people_connector",
    signatureName: "People Connector",
  },
];

function buildInitialSignatures(): SignatureShare[] {
  const weights = [16, 14, 13, 12, 11, 10, 9, 15];
  return normalizeSignatureShares(
    SIGNATURE_CATALOG.map((signature, index) => ({
      id: signature.id,
      name: signature.name,
      percentage: weights[index % weights.length] ?? 10,
    })),
  );
}

function computeStats(
  pool: Array<Pick<IndividualStanding, "score" | "company" | "signatureName">>,
  signatures: SignatureShare[],
  rewardsCollected: number,
): ArenaStats {
  const averageScore =
    pool.length === 0
      ? 0
      : roundScore(pool.reduce((sum, p) => sum + p.score, 0) / pool.length);

  const companies = new Set(pool.map((p) => p.company));

  return {
    participants: Math.max(pool.length, INITIAL_PARTICIPANT_COUNT),
    averageScore,
    rewardsCollected,
    companiesRepresented: Math.max(companies.size, 8),
    mostPopularSignature: signatures[0]?.name ?? "—",
  };
}

export interface ArenaRuntime {
  pool: PoolPerson[];
  rewardsCollected: number;
  lastMomentAt: number;
  seenCompanies: Set<string>;
  signatureMilestones: Set<string>;
}

export function createParticipant(
  overrides?: Partial<PoolPerson>,
): PoolPerson {
  const company =
    overrides?.company ??
    MOCK_COMPANIES[pickIndex(MOCK_COMPANIES.length)]!;
  const signature =
    SIGNATURE_CATALOG[pickIndex(SIGNATURE_CATALOG.length)]!;
  const first = MOCK_FIRST_NAMES[pickIndex(MOCK_FIRST_NAMES.length)]!;
  const last = MOCK_LAST_NAMES[pickIndex(MOCK_LAST_NAMES.length)]!;

  return {
    id: overrides?.id ?? createId("person"),
    name: overrides?.name ?? `${first} ${last}`,
    company,
    score: overrides?.score ?? roundScore(72 + Math.random() * 26),
    signatureId: overrides?.signatureId ?? signature.id,
    signatureName: overrides?.signatureName ?? signature.name,
  };
}

export function createInitialRuntime(): ArenaRuntime {
  const seeded = OPENING_CAST.map((person) => ({ ...person }));
  return {
    pool: seeded,
    rewardsCollected: INITIAL_REWARDS_COLLECTED,
    lastMomentAt: 0,
    seenCompanies: new Set(seeded.map((p) => p.company)),
    signatureMilestones: new Set(),
  };
}

export function snapshotFromRuntime(
  runtime: ArenaRuntime,
  previous: ArenaSnapshot | null,
  tick: number,
): ArenaSnapshot {
  const prevIndividualRanks = new Map(
    (previous?.individuals ?? []).map((entry) => [entry.id, entry.rank]),
  );
  const prevCompanyRanks = new Map(
    (previous?.companies ?? []).map((entry) => [entry.id, entry.rank]),
  );

  const signatures = previous?.signatures ?? buildInitialSignatures();
  const individuals = rankIndividuals(
    runtime.pool,
    prevIndividualRanks,
    SIMULATION_CONFIG.topN,
  );
  const companies = buildCompaniesFromIndividuals(
    runtime.pool,
    prevCompanyRanks,
    SIMULATION_CONFIG.topN,
  );
  const stats = computeStats(
    runtime.pool,
    signatures,
    runtime.rewardsCollected,
  );

  return {
    individuals,
    companies,
    signatures,
    stats,
    moment: null,
    tick,
    updatedAt: previous?.updatedAt ?? 0,
  };
}

export function createInitialSnapshot(): {
  snapshot: ArenaSnapshot;
  runtime: ArenaRuntime;
} {
  const runtime = createInitialRuntime();
  return {
    runtime,
    snapshot: snapshotFromRuntime(runtime, null, 0),
  };
}
