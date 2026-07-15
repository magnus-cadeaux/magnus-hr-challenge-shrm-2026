import type { KpiDefinition } from "./types";

/** Exhibition-floor mock KPIs for “How is today going?” */
export const MOCK_KPIS: KpiDefinition[] = [
  {
    id: "participants_today",
    label: "Participants Today",
    value: 186,
  },
  {
    id: "completed_challenges",
    label: "Completed Challenges",
    value: 154,
  },
  {
    id: "completion_rate",
    label: "Completion Rate",
    value: 82.8,
    suffix: "%",
    decimals: 1,
  },
  {
    id: "average_duration",
    label: "Average Duration",
    value: 4.2,
    suffix: " min",
    decimals: 1,
  },
  {
    id: "average_lead_score",
    label: "Average Lead Score",
    value: 74,
    achievement: true,
  },
  {
    id: "companies_represented",
    label: "Companies Represented",
    value: 47,
  },
  {
    id: "rewards_distributed",
    label: "Rewards Distributed",
    value: 141,
    achievement: true,
  },
  {
    id: "premium_upgrades",
    label: "Premium Upgrades",
    value: 4,
    achievement: true,
  },
];
