import type { ArenaSnapshot, SpecialMoment, SpecialMomentKind } from "./types";
import { createId } from "./utils";

export function buildSpecialMoment(
  kind: SpecialMomentKind,
  message: string,
): SpecialMoment {
  return {
    id: createId("moment"),
    kind,
    message,
    createdAt: Date.now(),
  };
}

/**
 * Pick a rare overlay moment from snapshot deltas.
 * Messages follow the Sprint 8 exhibition brief (including celebratory marks).
 */
export function maybeCreateMoment(
  previous: ArenaSnapshot,
  next: ArenaSnapshot,
  options: {
    allowed: boolean;
    seenCompanies: Set<string>;
    signatureMilestones: Set<string>;
    random?: () => number;
  },
): SpecialMoment | null {
  if (!options.allowed) return null;
  const random = options.random ?? Math.random;

  const previousLead = previous.companies[0]?.name;
  const nextLead = next.companies[0]?.name;
  if (nextLead && previousLead && nextLead !== previousLead && random() < 0.55) {
    return buildSpecialMoment("takes_lead", `🏆 ${nextLead} takes the lead`);
  }

  for (const company of next.companies) {
    if (!options.seenCompanies.has(company.name) && company.participants === 1) {
      options.seenCompanies.add(company.name);
      return buildSpecialMoment(
        "first_company",
        `🎉 First participant from ${company.name}`,
      );
    }
  }

  for (const signature of next.signatures) {
    if (
      signature.percentage >= 25 &&
      !options.signatureMilestones.has(signature.id)
    ) {
      options.signatureMilestones.add(signature.id);
      return buildSpecialMoment(
        "signature_milestone",
        `🌱 ${signature.name}s reach 25%`,
      );
    }
  }

  // Soft fallback moment for showcase energy
  if (random() < 0.25 && next.individuals[0]) {
    const lead = next.individuals[0];
    return buildSpecialMoment(
      "takes_lead",
      `🏆 ${lead.name} moves into first`,
    );
  }

  return null;
}
