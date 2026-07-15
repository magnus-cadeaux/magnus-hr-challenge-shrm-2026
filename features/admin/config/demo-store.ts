import { isBrowser } from "@/utils/device";
import type { KpiDefinition, RecentParticipant } from "./types";
import { MOCK_KPIS } from "./kpis";
import { MOCK_RECENT_PARTICIPANTS } from "./operations";
import { MOCK_CHARTS } from "./charts";
import type { ChartDefinition } from "./types";

const DEMO_CLEARED_KEY = "magnus.admin.demo.cleared";

export function isAdminDemoCleared(): boolean {
  if (!isBrowser()) return false;
  try {
    return window.localStorage.getItem(DEMO_CLEARED_KEY) === "true";
  } catch {
    return false;
  }
}

export function markAdminDemoCleared(): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(DEMO_CLEARED_KEY, "true");
}

export function readAdminKpis(): KpiDefinition[] {
  if (!isAdminDemoCleared()) return MOCK_KPIS;
  return MOCK_KPIS.map((kpi) => ({ ...kpi, value: 0 }));
}

export function readRecentParticipants(): RecentParticipant[] {
  if (!isAdminDemoCleared()) return MOCK_RECENT_PARTICIPANTS;
  return [];
}

export function readAdminCharts(): ChartDefinition[] {
  if (!isAdminDemoCleared()) return MOCK_CHARTS;
  return MOCK_CHARTS.map((chart) => ({
    ...chart,
    points: chart.points.map((point) => ({ ...point, value: 0 })),
  }));
}
