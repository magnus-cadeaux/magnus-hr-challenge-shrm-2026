import type { SignatureId } from "@/features/signature/engine/types";
import type { ConversationStarter, PainPointId } from "../engine/types";

export type ConversationTemplate = {
  id: string;
  template: string;
  signatureIds?: SignatureId[];
  painPointIds?: PainPointId[];
  priority?: number;
};

/**
 * Templates may include tokens:
 * {{primarySignature}} {{secondarySignature}} {{organization}} {{topPriority}}
 */
export const CONVERSATION_TEMPLATES: ConversationTemplate[] = [
  {
    id: "conv-experience",
    template:
      "I noticed employee experience ranked highly in your profile—how are you designing the moments that matter across the year?",
    signatureIds: ["experience_curator", "people_connector"],
    painPointIds: ["joining_kits", "recognition", "premium_gifting"],
    priority: 3,
  },
  {
    id: "conv-execution",
    template:
      "Your decisions lean toward reliable execution. Where does vendor reliability still create friction for your teams?",
    signatureIds: ["execution_expert", "strategic_planner"],
    painPointIds: ["vendor_reliability", "global_fulfilment"],
    priority: 3,
  },
  {
    id: "conv-sustainability",
    template:
      "Sustainability shows up clearly in your Magnus HR Signature™. Are you looking to embed that into gifting and celebrations without compromising quality?",
    signatureIds: ["sustainable_strategist"],
    painPointIds: ["sustainability"],
    priority: 3,
  },
  {
    id: "conv-innovation",
    template:
      "As an Innovation Catalyst profile, what’s one EX or rewards idea you’ve wanted to pilot but haven’t operationalised yet?",
    signatureIds: ["innovation_catalyst", "growth_enabler"],
    painPointIds: ["innovation", "employee_store"],
    priority: 2,
  },
  {
    id: "conv-culture",
    template:
      "Culture Builder profiles often want recognition that feels consistent, not campaign-only. How do managers experience that today?",
    signatureIds: ["culture_builder", "people_connector"],
    painPointIds: ["recognition"],
    priority: 2,
  },
  {
    id: "conv-priority",
    template:
      "Given {{organization}}’s likely focus on {{topPriority}}, what would a successful next 90 days look like?",
    priority: 1,
  },
  {
    id: "conv-signature-pair",
    template:
      "Your primary Signature is {{primarySignature}} with {{secondarySignature}} as a strong secondary—how do those two show up in your current programmes?",
    priority: 1,
  },
];

export type NextQuestionRule = {
  id: string;
  question: string;
  signatureIds?: SignatureId[];
  painPointIds?: PainPointId[];
  maturity?: Array<"emerging" | "growing" | "mature" | "enterprise">;
  weight: number;
};

export const NEXT_QUESTION_CATALOG: NextQuestionRule[] = [
  {
    id: "nq-vendor",
    question:
      "Where do your current partners fall short when celebrations or recognition need to scale quickly?",
    signatureIds: ["execution_expert", "strategic_planner"],
    painPointIds: ["vendor_reliability", "global_fulfilment"],
    weight: 3,
  },
  {
    id: "nq-joining",
    question:
      "What does an outstanding joining week look like for your organisation twelve months from now?",
    signatureIds: ["experience_curator", "growth_enabler"],
    painPointIds: ["joining_kits"],
    weight: 3,
  },
  {
    id: "nq-sustainability",
    question:
      "Which sustainability commitments are non-negotiable when you select gifting or merchandise partners?",
    signatureIds: ["sustainable_strategist"],
    painPointIds: ["sustainability"],
    weight: 3,
  },
  {
    id: "nq-recognition",
    question:
      "How visible is meaningful recognition for your high performers in the first 48 hours after a win?",
    signatureIds: ["people_connector", "culture_builder"],
    painPointIds: ["recognition"],
    weight: 2.5,
  },
  {
    id: "nq-enterprise",
    question:
      "If you had one integrated employee store and fulfilment layer, which teams would feel the impact first?",
    maturity: ["mature", "enterprise"],
    painPointIds: ["employee_store", "budget_optimisation"],
    weight: 2.5,
  },
  {
    id: "nq-default",
    question:
      "What is the one EX programme you wish felt more premium, reliable, and ownable by HR?",
    weight: 1,
  },
];

export const DEFAULT_CONVERSATION: ConversationStarter = {
  id: "conv-default",
  text: "Your Magnus HR Signature™ suggests a thoughtful approach to employee experience—what’s the priority you’re most focused on this quarter?",
};
