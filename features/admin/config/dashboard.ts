import { EVENT_NAME } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { readInventoryTier } from "./inventory-store";
import {
  readAdminCharts,
  readAdminKpis,
  readRecentParticipants,
} from "./demo-store";
import { MOCK_QUICK_ACTIONS } from "./actions";
import { MOCK_SYSTEM_HEALTH } from "./system-health";
import type { AdminDashboardSnapshot } from "./types";

export const ADMIN_APP_VERSION = "v1.0.0" as const;

export function buildAdminDashboardSnapshot(): AdminDashboardSnapshot {
  const supabaseReady = isSupabaseConfigured();

  return {
    eventName: EVENT_NAME,
    appVersion: ADMIN_APP_VERSION,
    kpis: readAdminKpis(),
    charts: readAdminCharts(),
    inventory: readInventoryTier(),
    recentParticipants: readRecentParticipants(),
    quickActions: MOCK_QUICK_ACTIONS,
    systemHealth: MOCK_SYSTEM_HEALTH.map((item) => {
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
    }),
  };
}
