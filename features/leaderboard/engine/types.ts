export type ArenaTab = "individuals" | "companies" | "signatures";

export type RankMovement = "up" | "down" | "same";

export type SpecialMomentKind =
  | "first_company"
  | "takes_lead"
  | "signature_milestone";

export interface IndividualStanding {
  id: string;
  name: string;
  company: string;
  score: number;
  signatureId: string;
  signatureName: string;
  rank: number;
  previousRank: number;
  movement: RankMovement;
}

export interface CompanyStanding {
  id: string;
  name: string;
  averageScore: number;
  participants: number;
  rank: number;
  previousRank: number;
  movement: RankMovement;
}

export interface SignatureShare {
  id: string;
  name: string;
  percentage: number;
}

export interface ArenaStats {
  participants: number;
  averageScore: number;
  rewardsCollected: number;
  companiesRepresented: number;
  mostPopularSignature: string;
}

export interface SpecialMoment {
  id: string;
  kind: SpecialMomentKind;
  message: string;
  createdAt: number;
}

export interface ArenaSnapshot {
  individuals: IndividualStanding[];
  companies: CompanyStanding[];
  signatures: SignatureShare[];
  stats: ArenaStats;
  moment: SpecialMoment | null;
  tick: number;
  updatedAt: number;
}

export interface SimulationConfig {
  /** Min ms between mock live ticks */
  tickMinMs: number;
  /** Max ms between mock live ticks */
  tickMaxMs: number;
  /** Quote rotation interval */
  quoteIntervalMs: number;
  /** Special moment on-screen duration */
  momentDurationMs: number;
  /** Chance (0–1) a tick produces a special moment */
  momentProbability: number;
  /** Min ms between special moments */
  momentCooldownMs: number;
  /** Chance a tick introduces a new participant */
  joinProbability: number;
  topN: number;
}
