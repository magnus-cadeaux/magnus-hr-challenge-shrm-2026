import type { RecommendationDefinition } from "../engine/types";

export const RECOMMENDATION_CATALOG: RecommendationDefinition[] = [
  {
    id: "rec-community-hub",
    title: "Community Hub",
    signatureIds: ["innovation_catalyst", "people_connector"],
    dimension: "innovation",
  },
  {
    id: "rec-merchandise-portal",
    title: "Corporate Merchandise Portal",
    signatureIds: ["innovation_catalyst", "execution_expert"],
    dimension: "innovation",
  },
  {
    id: "rec-joining-kits",
    title: "Creative Joining Kits",
    signatureIds: ["innovation_catalyst", "experience_curator", "growth_enabler"],
    dimension: "innovation",
  },
  {
    id: "rec-welcome-kits",
    title: "Welcome Kits",
    signatureIds: ["culture_builder", "experience_curator"],
    dimension: "culture",
  },
  {
    id: "rec-recognition-programs",
    title: "Recognition Programs",
    signatureIds: ["culture_builder", "people_connector"],
    dimension: "culture",
  },
  {
    id: "rec-celebration-boxes",
    title: "Employee Celebration Boxes",
    signatureIds: ["culture_builder", "experience_curator", "people_connector"],
    dimension: "culture",
  },
  {
    id: "rec-pan-india",
    title: "PAN India Fulfilment",
    signatureIds: ["execution_expert", "strategic_planner"],
    dimension: "execution",
  },
  {
    id: "rec-qc-deliveries",
    title: "QC Managed Deliveries",
    signatureIds: ["execution_expert"],
    dimension: "execution",
  },
  {
    id: "rec-inventory",
    title: "Inventory Planning",
    signatureIds: ["execution_expert", "strategic_planner", "growth_enabler"],
    dimension: "execution",
  },
  {
    id: "rec-eco-packaging",
    title: "Eco Packaging",
    signatureIds: ["sustainable_strategist"],
    dimension: "sustainability",
  },
  {
    id: "rec-felt-bags",
    title: "Felt Bags",
    signatureIds: ["sustainable_strategist", "experience_curator"],
    dimension: "sustainability",
  },
  {
    id: "rec-recycled",
    title: "Recycled Merchandise",
    signatureIds: ["sustainable_strategist", "innovation_catalyst"],
    dimension: "sustainability",
  },
  {
    id: "rec-experience-journeys",
    title: "Moments-based EX Journeys",
    signatureIds: ["experience_curator", "growth_enabler"],
    dimension: "experience",
  },
  {
    id: "rec-leadership-cadence",
    title: "Leadership Recognition Cadence",
    signatureIds: ["strategic_planner", "people_connector"],
    dimension: "strategy",
  },
  {
    id: "rec-manager-enablement",
    title: "Manager Enablement Kits",
    signatureIds: ["growth_enabler", "culture_builder"],
    dimension: "growth",
  },
];
