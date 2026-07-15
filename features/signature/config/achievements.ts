import type { AchievementDefinition } from "../engine/types";

export const ACHIEVEMENT_CATALOG: AchievementDefinition[] = [
  {
    id: "ach-innovation-mindset",
    title: "Innovation Mindset",
    description: "You favoured forward-leaning ideas with practical grounding.",
    dimension: "innovation",
    rule: "top_dimension",
  },
  {
    id: "ach-eco-thinker",
    title: "Eco Thinker",
    description: "Sustainability shaped how you weighed programme choices.",
    dimension: "sustainability",
    rule: "top_dimension",
  },
  {
    id: "ach-people-first",
    title: "People First",
    description: "Human impact stayed visible across your decisions.",
    dimension: "experience",
    rule: "top_dimension",
  },
  {
    id: "ach-fast-decision",
    title: "Fast Decision Maker",
    description: "You moved through the challenge with clear conviction.",
    rule: "fast_decisions",
  },
  {
    id: "ach-strategic-vision",
    title: "Strategic Vision",
    description: "You connected near-term choices to longer horizons.",
    dimension: "strategy",
    rule: "top_dimension",
  },
  {
    id: "ach-culture-champion",
    title: "Culture Champion",
    description: "Belonging and shared rituals guided your judgement.",
    dimension: "culture",
    rule: "top_dimension",
  },
  {
    id: "ach-balanced",
    title: "Balanced Operator",
    description: "Your profile shows range across multiple leadership lenses.",
    rule: "balanced_profile",
  },
];
