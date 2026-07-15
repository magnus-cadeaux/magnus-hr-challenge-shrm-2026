import type { SystemHealthItem } from "./types";

export const MOCK_SYSTEM_HEALTH: SystemHealthItem[] = [
  {
    id: "internet",
    label: "Internet",
    value: "Online",
    status: "online",
  },
  {
    id: "session_storage",
    label: "Session Storage",
    value: "Healthy",
    status: "healthy",
  },
  {
    id: "sync_queue",
    label: "Sync Queue",
    value: "Ready",
    status: "ready",
  },
  {
    id: "supabase",
    label: "Supabase",
    value: "Not Connected",
    status: "placeholder",
  },
  {
    id: "app_version",
    label: "Application Version",
    value: "v1.0.0",
    status: "healthy",
  },
];
