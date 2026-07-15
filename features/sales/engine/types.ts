import type { ChallengeSessionState } from "@/features/challenge/engine/types";
import type {
  ProfileScores,
  SignatureId,
  SignatureProfileResult,
} from "@/features/signature/engine/types";

export type DecisionConfidence = "low" | "medium" | "high";

export type OrganisationMaturity =
  | "emerging"
  | "growing"
  | "mature"
  | "enterprise";

export type PainPointId =
  | "vendor_reliability"
  | "innovation"
  | "sustainability"
  | "recognition"
  | "joining_kits"
  | "employee_store"
  | "corporate_apparel"
  | "global_fulfilment"
  | "premium_gifting"
  | "budget_optimisation";

export type BuyingInterestId =
  | "welcome_kits"
  | "recognition_programs"
  | "celebration_boxes"
  | "joining_kits"
  | "merchandise_portal"
  | "employee_store"
  | "corporate_apparel"
  | "pan_india_fulfilment"
  | "eco_packaging"
  | "premium_gifting"
  | "community_hub"
  | "inventory_planning";

export type MagnusProductId =
  | "community_hub"
  | "corporate_merchandise_portal"
  | "creative_joining_kits"
  | "welcome_kits"
  | "recognition_programs"
  | "employee_celebration_boxes"
  | "pan_india_fulfilment"
  | "qc_managed_deliveries"
  | "inventory_planning"
  | "eco_packaging"
  | "felt_bags"
  | "recycled_merchandise"
  | "moments_ex_journeys"
  | "leadership_recognition_cadence"
  | "manager_enablement_kits";

export type LeadParticipantInput = {
  fullName: string;
  organization: string;
  email: string;
  phone: string;
};

export type InteractionBehaviour = {
  /** Average ms per decision; lower = faster/more decisive */
  averageDecisionMs: number;
  /** Total challenge duration in ms */
  elapsedMs: number;
  /** Answered question count */
  decisionsCompleted: number;
  /** Distinct categories touched */
  categoriesTouched: number;
  /** Ranking questions completed (signals deliberation) */
  rankingCompletions: number;
};

export type LeadIntelligenceInput = {
  participant: LeadParticipantInput;
  challenge: ChallengeSessionState;
  signature: SignatureProfileResult;
  behaviour: InteractionBehaviour;
};

export type ScoredItem<T extends string = string> = {
  id: T;
  label: string;
  score: number;
  reasons: string[];
  /** Optional suggested opening line (products) */
  opening?: string;
};

export type ConversationStarter = {
  id: string;
  text: string;
  relatedSignatureId?: SignatureId;
  relatedPainPointId?: PainPointId;
};

export type LeadIntelligenceProfile = {
  version: 1;
  generatedAt: string;
  sessionId: string;
  participant: LeadParticipantInput;
  leadScore: number;
  decisionConfidence: DecisionConfidence;
  organisationMaturity: OrganisationMaturity;
  likelyPriorities: ScoredItem[];
  likelyBuyingInterests: ScoredItem<BuyingInterestId>[];
  painPoints: ScoredItem<PainPointId>[];
  recommendedConversation: ConversationStarter[];
  recommendedProducts: ScoredItem<MagnusProductId>[];
  recommendedNextQuestion: string;
  signals: {
    primarySignatureId: SignatureId;
    secondarySignatureId: SignatureId;
    profileScores: ProfileScores;
    achievementIds: string[];
    behaviour: InteractionBehaviour;
  };
};
