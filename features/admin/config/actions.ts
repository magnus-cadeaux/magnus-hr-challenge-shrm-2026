import type { QuickActionDefinition } from "./types";

export const MOCK_QUICK_ACTIONS: QuickActionDefinition[] = [
  {
    id: "reset_demo",
    label: "Reset Demo Data",
    description: "Clear booth mock state",
    tone: "caution",
  },
  {
    id: "start_new_day",
    label: "Start New Day",
    description: "Roll leaderboard to a fresh event day",
    tone: "default",
  },
  {
    id: "export_participants",
    label: "Export Participants",
    description: "Placeholder CSV export",
    tone: "quiet",
  },
  {
    id: "export_leads",
    label: "Export Leads",
    description: "Placeholder sales export",
    tone: "quiet",
  },
  {
    id: "export_inventory",
    label: "Export Inventory",
    description: "Placeholder stock report",
    tone: "quiet",
  },
  {
    id: "reset_leaderboard",
    label: "Reset Leaderboard",
    description: "Clear today's arena standings",
    tone: "caution",
  },
  {
    id: "reset_rewards",
    label: "Reset Rewards",
    description: "Zero reserved & distributed counters",
    tone: "caution",
  },
];
