import type { ChartDefinition } from "./types";

export const MOCK_CHARTS: ChartDefinition[] = [
  {
    id: "participants_per_hour",
    title: "Participants per Hour",
    subtitle: "Booth traffic since open",
    kind: "vertical",
    points: [
      { id: "h09", label: "9a", value: 8 },
      { id: "h10", label: "10a", value: 14 },
      { id: "h11", label: "11a", value: 22 },
      { id: "h12", label: "12p", value: 18 },
      { id: "h13", label: "1p", value: 12 },
      { id: "h14", label: "2p", value: 26 },
      { id: "h15", label: "3p", value: 31 },
      { id: "h16", label: "4p", value: 28 },
      { id: "h17", label: "5p", value: 19 },
    ],
  },
  {
    id: "top_signatures",
    title: "Top HR Signatures",
    subtitle: "Distribution live today",
    kind: "horizontal",
    points: [
      { id: "innovation_catalyst", label: "Innovation Catalyst", value: 22 },
      { id: "execution_expert", label: "Execution Expert", value: 18 },
      { id: "culture_builder", label: "Culture Builder", value: 16 },
      { id: "experience_curator", label: "Experience Curator", value: 14 },
      { id: "people_connector", label: "People Connector", value: 12 },
    ],
  },
  {
    id: "top_industries",
    title: "Top Company Industries",
    subtitle: "Organisations on the floor",
    kind: "horizontal",
    points: [
      { id: "tech", label: "Technology", value: 34 },
      { id: "pharma", label: "Pharma & Life Sciences", value: 18 },
      { id: "consulting", label: "Consulting", value: 14 },
      { id: "bfsi", label: "BFSI", value: 11 },
      { id: "manufacturing", label: "Manufacturing", value: 9 },
    ],
  },
  {
    id: "top_priorities",
    title: "Most Selected Priorities",
    subtitle: "Inferred sales signals",
    kind: "horizontal",
    points: [
      { id: "recognition", label: "Recognition consistency", value: 29 },
      { id: "onboarding", label: "Onboarding & joining", value: 24 },
      { id: "fulfilment", label: "Reliable fulfilment", value: 21 },
      { id: "sustainability", label: "Sustainable programmes", value: 17 },
      { id: "innovation", label: "Innovation in EX", value: 15 },
    ],
  },
];
