import { EVENT_NAME } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { readInventoryTier } from "./inventory-store";
import { loadLiveAdminMetrics } from "./live-metrics";
import { MOCK_QUICK_ACTIONS } from "./actions";
import { MOCK_SYSTEM_HEALTH } from "./system-health";
import type { AdminDashboardSnapshot, KpiDefinition, ChartDefinition } from "./types";

export const ADMIN_APP_VERSION = "v1.0.0" as const;

function emptyKpis(): KpiDefinition[] {
  return [
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
}

function emptyCharts(): ChartDefinition[] {
  return [
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
}

function withSystemHealth() {
  const supabaseReady = isSupabaseConfigured();
  return MOCK_SYSTEM_HEALTH.map((item) => {
    if (item.id === "app_version") {
      return { ...item, value: ADMIN_APP_VERSION };
    }
    if (item.id === "supabase") {
      return supabaseReady
        ? { ...item, value: "Connected", status: "healthy" as const }
        : { ...item, value: "Not Connected", status: "placeholder" as const };
    }
    if (item.id === "sync_queue") {
      return supabaseReady
        ? { ...item, value: "Ready", status: "ready" as const }
        : { ...item, value: "Local only", status: "ready" as const };
    }
    return item;
  });
}

/** Synchronous placeholder used for first paint before live metrics resolve. */
export function buildAdminDashboardSnapshot(): AdminDashboardSnapshot {
  return {
    eventName: EVENT_NAME,
    appVersion: ADMIN_APP_VERSION,
    kpis: emptyKpis(),
    charts: emptyCharts(),
    inventory: readInventoryTier(),
    recentParticipants: [],
    quickActions: MOCK_QUICK_ACTIONS,
    systemHealth: withSystemHealth(),
  };
}

/** Load real KPI / chart / recent-participant data from Supabase (or Dexie). */
export async function loadAdminDashboardSnapshot(): Promise<AdminDashboardSnapshot> {
  const metrics = await loadLiveAdminMetrics();
  return {
    eventName: EVENT_NAME,
    appVersion: ADMIN_APP_VERSION,
    kpis: metrics.kpis,
    charts: metrics.charts,
    inventory: readInventoryTier(),
    recentParticipants: metrics.recentParticipants,
    quickActions: MOCK_QUICK_ACTIONS,
    systemHealth: withSystemHealth(),
  };
}
