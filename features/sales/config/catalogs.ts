import type { ProfileDimension, SignatureId } from "@/features/signature/engine/types";
import type {
  BuyingInterestId,
  MagnusProductId,
  OrganisationMaturity,
  PainPointId,
} from "../engine/types";

/** Lead score weights — must sum conceptually to a 0–100 outcome after clamp. */
export const LEAD_SCORE_WEIGHTS = {
  signatureStrength: 28,
  engagement: 22,
  identityCompleteness: 18,
  achievementSignal: 12,
  maturityFit: 12,
  confidenceBoost: 8,
} as const;

export const CONFIDENCE_THRESHOLDS = {
  highMaxAverageMs: 14_000,
  mediumMaxAverageMs: 28_000,
  highMinDecisions: 6,
} as const;

export const MATURITY_BY_COMPANY: Partial<Record<string, OrganisationMaturity>> = {
  Google: "enterprise",
  Microsoft: "enterprise",
  Apple: "enterprise",
  IBM: "enterprise",
  Infosys: "mature",
  Qualcomm: "enterprise",
  ServiceNow: "mature",
  Salesforce: "enterprise",
  Micron: "mature",
  "Eli Lilly": "enterprise",
  Carelon: "growing",
  Amgen: "enterprise",
  Other: "growing",
};

export const MATURITY_FROM_PROFILE: Array<{
  id: OrganisationMaturity;
  minStrategy: number;
  minExecution: number;
  minAverage: number;
}> = [
  { id: "enterprise", minStrategy: 70, minExecution: 65, minAverage: 62 },
  { id: "mature", minStrategy: 55, minExecution: 50, minAverage: 48 },
  { id: "growing", minStrategy: 35, minExecution: 30, minAverage: 32 },
  { id: "emerging", minStrategy: 0, minExecution: 0, minAverage: 0 },
];

export type PriorityRule = {
  id: string;
  label: string;
  dimensions: ProfileDimension[];
  signatureIds: SignatureId[];
  weight: number;
};

export const PRIORITY_CATALOG: PriorityRule[] = [
  {
    id: "priority-ex-design",
    label: "Employee experience design",
    dimensions: ["experience", "connection"],
    signatureIds: ["experience_curator", "people_connector"],
    weight: 1.2,
  },
  {
    id: "priority-recognition",
    label: "Recognition consistency",
    dimensions: ["connection", "culture"],
    signatureIds: ["people_connector", "culture_builder"],
    weight: 1.15,
  },
  {
    id: "priority-onboarding",
    label: "Onboarding & joining moments",
    dimensions: ["experience", "growth"],
    signatureIds: ["experience_curator", "growth_enabler"],
    weight: 1.1,
  },
  {
    id: "priority-fulfilment",
    label: "Reliable fulfilment at scale",
    dimensions: ["execution", "strategy"],
    signatureIds: ["execution_expert", "strategic_planner"],
    weight: 1.2,
  },
  {
    id: "priority-sustainability",
    label: "Sustainable celebration programmes",
    dimensions: ["sustainability", "strategy"],
    signatureIds: ["sustainable_strategist", "strategic_planner"],
    weight: 1.15,
  },
  {
    id: "priority-innovation",
    label: "Innovation in rewards & EX",
    dimensions: ["innovation", "growth"],
    signatureIds: ["innovation_catalyst", "growth_enabler"],
    weight: 1.1,
  },
  {
    id: "priority-culture",
    label: "Culture rituals & belonging",
    dimensions: ["culture", "connection"],
    signatureIds: ["culture_builder", "people_connector"],
    weight: 1.05,
  },
  {
    id: "priority-vendor",
    label: "Vendor partner reliability",
    dimensions: ["execution", "experience"],
    signatureIds: ["execution_expert", "experience_curator"],
    weight: 1.1,
  },
];

export type InterestRule = {
  id: BuyingInterestId;
  label: string;
  dimensions: ProfileDimension[];
  signatureIds: SignatureId[];
  maturityBoost?: OrganisationMaturity[];
  weight: number;
};

export const BUYING_INTEREST_CATALOG: InterestRule[] = [
  {
    id: "welcome_kits",
    label: "Welcome Kits",
    dimensions: ["experience", "culture"],
    signatureIds: ["experience_curator", "culture_builder"],
    weight: 1.2,
  },
  {
    id: "recognition_programs",
    label: "Recognition Programs",
    dimensions: ["connection", "culture"],
    signatureIds: ["people_connector", "culture_builder"],
    weight: 1.25,
  },
  {
    id: "celebration_boxes",
    label: "Celebration Boxes",
    dimensions: ["experience", "connection"],
    signatureIds: ["experience_curator", "people_connector"],
    weight: 1.1,
  },
  {
    id: "joining_kits",
    label: "Joining Kits",
    dimensions: ["experience", "growth"],
    signatureIds: ["experience_curator", "growth_enabler", "innovation_catalyst"],
    weight: 1.2,
  },
  {
    id: "merchandise_portal",
    label: "Merchandise Portal",
    dimensions: ["innovation", "execution"],
    signatureIds: ["innovation_catalyst", "execution_expert"],
    maturityBoost: ["mature", "enterprise"],
    weight: 1.15,
  },
  {
    id: "employee_store",
    label: "Employee Store",
    dimensions: ["innovation", "growth"],
    signatureIds: ["innovation_catalyst", "growth_enabler"],
    maturityBoost: ["mature", "enterprise"],
    weight: 1.1,
  },
  {
    id: "corporate_apparel",
    label: "Corporate Apparel",
    dimensions: ["culture", "execution"],
    signatureIds: ["culture_builder", "execution_expert"],
    weight: 1,
  },
  {
    id: "pan_india_fulfilment",
    label: "PAN India Fulfilment",
    dimensions: ["execution", "strategy"],
    signatureIds: ["execution_expert", "strategic_planner"],
    maturityBoost: ["growing", "mature", "enterprise"],
    weight: 1.2,
  },
  {
    id: "eco_packaging",
    label: "Eco Packaging",
    dimensions: ["sustainability"],
    signatureIds: ["sustainable_strategist"],
    weight: 1.25,
  },
  {
    id: "premium_gifting",
    label: "Premium Gifting",
    dimensions: ["experience", "connection"],
    signatureIds: ["experience_curator", "people_connector"],
    weight: 1.1,
  },
  {
    id: "community_hub",
    label: "Community Hub",
    dimensions: ["innovation", "connection"],
    signatureIds: ["innovation_catalyst", "people_connector"],
    weight: 1.05,
  },
  {
    id: "inventory_planning",
    label: "Inventory Planning",
    dimensions: ["execution", "strategy"],
    signatureIds: ["execution_expert", "strategic_planner"],
    weight: 1.05,
  },
];

export type PainPointRule = {
  id: PainPointId;
  label: string;
  dimensions: ProfileDimension[];
  signatureIds: SignatureId[];
  weight: number;
};

export const PAIN_POINT_CATALOG: PainPointRule[] = [
  {
    id: "vendor_reliability",
    label: "Vendor Reliability",
    dimensions: ["execution", "experience"],
    signatureIds: ["execution_expert"],
    weight: 1.2,
  },
  {
    id: "innovation",
    label: "Innovation",
    dimensions: ["innovation", "growth"],
    signatureIds: ["innovation_catalyst"],
    weight: 1.15,
  },
  {
    id: "sustainability",
    label: "Sustainability",
    dimensions: ["sustainability"],
    signatureIds: ["sustainable_strategist"],
    weight: 1.2,
  },
  {
    id: "recognition",
    label: "Recognition",
    dimensions: ["connection", "culture"],
    signatureIds: ["people_connector", "culture_builder"],
    weight: 1.15,
  },
  {
    id: "joining_kits",
    label: "Joining Kits",
    dimensions: ["experience", "growth"],
    signatureIds: ["experience_curator", "growth_enabler"],
    weight: 1.1,
  },
  {
    id: "employee_store",
    label: "Employee Store",
    dimensions: ["innovation", "execution"],
    signatureIds: ["innovation_catalyst", "execution_expert"],
    weight: 1.05,
  },
  {
    id: "corporate_apparel",
    label: "Corporate Apparel",
    dimensions: ["culture", "execution"],
    signatureIds: ["culture_builder"],
    weight: 1,
  },
  {
    id: "global_fulfilment",
    label: "Global Fulfilment",
    dimensions: ["execution", "strategy"],
    signatureIds: ["execution_expert", "strategic_planner"],
    weight: 1.15,
  },
  {
    id: "premium_gifting",
    label: "Premium Gifting",
    dimensions: ["experience", "connection"],
    signatureIds: ["experience_curator"],
    weight: 1.1,
  },
  {
    id: "budget_optimisation",
    label: "Budget Optimisation",
    dimensions: ["strategy", "execution"],
    signatureIds: ["strategic_planner", "execution_expert"],
    weight: 1.1,
  },
];

export type ProductRule = {
  id: MagnusProductId;
  label: string;
  signatureIds: SignatureId[];
  interestIds: BuyingInterestId[];
  painPointIds: PainPointId[];
  weight: number;
  /** Suggested salesperson opening for this solution */
  opening: string;
};

export const PRODUCT_CATALOG: ProductRule[] = [
  {
    id: "community_hub",
    label: "Community Hub",
    signatureIds: ["innovation_catalyst", "people_connector"],
    interestIds: ["community_hub", "merchandise_portal"],
    painPointIds: ["innovation", "employee_store"],
    weight: 1.1,
    opening:
      "Would a branded community hub help your teams celebrate wins without juggling vendors?",
  },
  {
    id: "corporate_merchandise_portal",
    label: "Corporate Merchandise Portal",
    signatureIds: ["innovation_catalyst", "execution_expert"],
    interestIds: ["merchandise_portal", "employee_store", "corporate_apparel"],
    painPointIds: ["employee_store", "budget_optimisation"],
    weight: 1.2,
    opening:
      "How close are you to a self-serve merchandise portal that still protects brand and budget?",
  },
  {
    id: "creative_joining_kits",
    label: "Creative Joining Kits",
    signatureIds: ["innovation_catalyst", "experience_curator", "growth_enabler"],
    interestIds: ["joining_kits", "welcome_kits"],
    painPointIds: ["joining_kits"],
    weight: 1.25,
    opening:
      "What does day-one look like today—and where do joining kits fall short of the culture you want?",
  },
  {
    id: "welcome_kits",
    label: "Welcome Kits",
    signatureIds: ["culture_builder", "experience_curator"],
    interestIds: ["welcome_kits", "joining_kits"],
    painPointIds: ["joining_kits", "recognition"],
    weight: 1.2,
    opening:
      "If welcome kits carried your culture clearly, what would change in those first thirty days?",
  },
  {
    id: "recognition_programs",
    label: "Recognition Programs",
    signatureIds: ["culture_builder", "people_connector"],
    interestIds: ["recognition_programs", "celebration_boxes"],
    painPointIds: ["recognition"],
    weight: 1.25,
    opening:
      "Is recognition consistent across teams today, or still dependent on individual managers?",
  },
  {
    id: "employee_celebration_boxes",
    label: "Employee Celebration Boxes",
    signatureIds: ["experience_curator", "people_connector", "culture_builder"],
    interestIds: ["celebration_boxes", "premium_gifting"],
    painPointIds: ["premium_gifting", "recognition"],
    weight: 1.15,
    opening:
      "Which milestones deserve a celebration moment that people still talk about next quarter?",
  },
  {
    id: "pan_india_fulfilment",
    label: "PAN India Fulfilment",
    signatureIds: ["execution_expert", "strategic_planner"],
    interestIds: ["pan_india_fulfilment"],
    painPointIds: ["vendor_reliability", "global_fulfilment"],
    weight: 1.3,
    opening:
      "Where does multi-city fulfilment create the most risk for your employee programmes?",
  },
  {
    id: "qc_managed_deliveries",
    label: "QC Managed Deliveries",
    signatureIds: ["execution_expert"],
    interestIds: ["pan_india_fulfilment", "premium_gifting"],
    painPointIds: ["vendor_reliability"],
    weight: 1.2,
    opening:
      "When quality slips on a delivery, how visible is that to leadership and to employees?",
  },
  {
    id: "inventory_planning",
    label: "Inventory Planning",
    signatureIds: ["execution_expert", "strategic_planner", "growth_enabler"],
    interestIds: ["inventory_planning", "merchandise_portal"],
    painPointIds: ["budget_optimisation", "global_fulfilment"],
    weight: 1.1,
    opening:
      "Are you holding too much stock—or scrambling because you can’t see demand ahead?",
  },
  {
    id: "eco_packaging",
    label: "Eco Packaging",
    signatureIds: ["sustainable_strategist"],
    interestIds: ["eco_packaging"],
    painPointIds: ["sustainability"],
    weight: 1.3,
    opening:
      "How important is sustainable packaging when your team evaluates partners this year?",
  },
  {
    id: "felt_bags",
    label: "Felt Bags",
    signatureIds: ["sustainable_strategist", "experience_curator"],
    interestIds: ["eco_packaging", "premium_gifting"],
    painPointIds: ["sustainability", "premium_gifting"],
    weight: 1.1,
    opening:
      "Would a premium recycled felt piece help your gifts feel thoughtful without excess waste?",
  },
  {
    id: "recycled_merchandise",
    label: "Recycled Merchandise",
    signatureIds: ["sustainable_strategist", "innovation_catalyst"],
    interestIds: ["eco_packaging", "corporate_apparel"],
    painPointIds: ["sustainability", "innovation"],
    weight: 1.15,
    opening:
      "Is recycled merchandise already on the table, or still stuck in the pilot phase?",
  },
  {
    id: "moments_ex_journeys",
    label: "Moments-based EX Journeys",
    signatureIds: ["experience_curator", "growth_enabler"],
    interestIds: ["welcome_kits", "recognition_programs"],
    painPointIds: ["recognition", "joining_kits"],
    weight: 1.15,
    opening:
      "Which employee journey moments still feel operational instead of designed?",
  },
  {
    id: "leadership_recognition_cadence",
    label: "Leadership Recognition Cadence",
    signatureIds: ["strategic_planner", "people_connector"],
    interestIds: ["recognition_programs"],
    painPointIds: ["recognition"],
    weight: 1.1,
    opening:
      "Do leaders have a repeatable recognition cadence, or does it reset every campaign?",
  },
  {
    id: "manager_enablement_kits",
    label: "Manager Enablement Kits",
    signatureIds: ["growth_enabler", "culture_builder"],
    interestIds: ["welcome_kits", "joining_kits"],
    painPointIds: ["joining_kits", "recognition"],
    weight: 1.1,
    opening:
      "What would managers need in hand to make recognition and onboarding feel effortless?",
  },
];
