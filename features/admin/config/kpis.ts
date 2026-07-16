import type { KpiDefinition } from "./types";

/** Empty KPI shell — live values come from `loadLiveAdminMetrics`. */
export const MOCK_KPIS: KpiDefinition[] = [
  { id: "participants_today", label: "Participants Today", value: 0 },
  { id: "completed_challenges", label: "Completed Challenges", value: 0 },
  {
    id: "completion_rate",
    label: "Completion Rate",
    value: 0,
    suffix: "%",
    decimals: 1,
  },
  {
    id: "average_duration",
    label: "Average Duration",
    value: 0,
    suffix: " min",
    decimals: 1,
  },
  {
    id: "average_lead_score",
    label: "Average Lead Score",
    value: 0,
    achievement: true,
  },
  { id: "companies_represented", label: "Companies Represented", value: 0 },
  {
    id: "rewards_distributed",
    label: "Rewards Distributed",
    value: 0,
    achievement: true,
  },
  {
    id: "premium_upgrades",
    label: "Premium Upgrades",
    value: 0,
    achievement: true,
  },
];
