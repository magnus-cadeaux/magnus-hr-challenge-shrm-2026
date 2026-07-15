import {
  CONVERSATION_TEMPLATES,
  DEFAULT_CONVERSATION,
  NEXT_QUESTION_CATALOG,
} from "../config/conversation";
import type {
  ConversationStarter,
  OrganisationMaturity,
  PainPointId,
  ScoredItem,
} from "./types";
import type { SignatureProfileResult } from "@/features/signature/engine/types";
import { topN } from "./utils";

function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");
}

export function resolveConversationStarters(
  signature: SignatureProfileResult,
  organization: string,
  priorities: ScoredItem[],
  painPoints: ScoredItem<PainPointId>[],
  limit = 3,
): ConversationStarter[] {
  const painIds = new Set(painPoints.map((item) => item.id));
  const topPriority = priorities[0]?.label ?? "employee experience";

  const tokens = {
    primarySignature: signature.primary.name,
    secondarySignature: signature.secondary.name,
    organization: organization || "your organisation",
    topPriority,
  };

  const scored = CONVERSATION_TEMPLATES.map((template) => {
    let score = template.priority ?? 0;
    if (template.signatureIds?.includes(signature.primary.id)) score += 4;
    if (template.signatureIds?.includes(signature.secondary.id)) score += 2;
    if (template.painPointIds?.some((id) => painIds.has(id))) score += 3;
    return {
      id: template.id,
      text: fillTemplate(template.template, tokens),
      relatedSignatureId: template.signatureIds?.[0],
      relatedPainPointId: template.painPointIds?.[0],
      score,
    };
  });

  const selected: ConversationStarter[] = topN(scored, limit).map(
    ({ score: _score, ...starter }) => starter,
  );

  while (selected.length < limit) {
    selected.push({
      ...DEFAULT_CONVERSATION,
      id: `${DEFAULT_CONVERSATION.id}-${selected.length}`,
    });
  }

  return selected.slice(0, limit);
}

export function resolveNextQuestion(
  signature: SignatureProfileResult,
  maturity: OrganisationMaturity,
  painPoints: ScoredItem<PainPointId>[],
): string {
  const painIds = new Set(painPoints.map((item) => item.id));

  const ranked = NEXT_QUESTION_CATALOG.map((rule) => {
    let score = rule.weight;
    if (rule.signatureIds?.includes(signature.primary.id)) score += 3;
    if (rule.signatureIds?.includes(signature.secondary.id)) score += 1.5;
    if (rule.painPointIds?.some((id) => painIds.has(id))) score += 2.5;
    if (rule.maturity?.includes(maturity)) score += 2;
    return { question: rule.question, score };
  });

  return topN(ranked, 1)[0]?.question ?? NEXT_QUESTION_CATALOG.at(-1)!.question;
}
