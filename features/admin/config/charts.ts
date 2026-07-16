import type { ChartDefinition } from "./types";

/** Empty chart shell — live values come from `loadLiveAdminMetrics`. */
export const MOCK_CHARTS: ChartDefinition[] = [
  {
    id: "participants_per_hour",
    title: "Participants per Hour",
    subtitle: "Booth traffic since open",
    kind: "vertical",
    points: [],
  },
  {
    id: "top_signatures",
    title: "Top HR Signatures",
    subtitle: "Distribution live today",
    kind: "horizontal",
    points: [],
  },
  {
    id: "top_industries",
    title: "Top Company Industries",
    subtitle: "Organisations on the floor",
    kind: "horizontal",
    points: [],
  },
  {
    id: "top_priorities",
    title: "Most Selected Priorities",
    subtitle: "Inferred sales signals",
    kind: "horizontal",
    points: [],
  },
];
