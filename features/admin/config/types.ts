export type KpiId =
  | "participants_today"
  | "completed_challenges"
  | "completion_rate"
  | "average_duration"
  | "average_lead_score"
  | "companies_represented"
  | "rewards_distributed"
  | "premium_upgrades";

export type KpiDefinition = {
  id: KpiId;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  achievement?: boolean;
};

export type ChartPoint = {
  id: string;
  label: string;
  value: number;
};

export type ChartDefinition = {
  id: string;
  title: string;
  subtitle: string;
  kind: "vertical" | "horizontal";
  points: ChartPoint[];
};

export type InventoryTierId = "A" | "B" | "C" | "premium_upgrade";

export type InventoryTierSnapshot = {
  id: InventoryTierId;
  label: string;
  available: number;
  reserved: number;
  distributed: number;
  lowStockThreshold: number;
};

export type ConversationStatus = "pending" | "in_progress" | "complete";

export type RecentParticipant = {
  id: string;
  name: string;
  company: string;
  signature: string;
  gift: string;
  leadScore: number;
  conversationStatus: ConversationStatus;
  completedAt: string;
};

export type QuickActionId =
  | "reset_demo"
  | "start_new_day"
  | "export_participants"
  | "export_leads"
  | "export_inventory"
  | "reset_leaderboard"
  | "reset_rewards";

export type QuickActionDefinition = {
  id: QuickActionId;
  label: string;
  description: string;
  tone: "default" | "caution" | "quiet";
};

export type SystemHealthStatus = "online" | "offline" | "healthy" | "ready" | "placeholder";

export type SystemHealthItem = {
  id: string;
  label: string;
  value: string;
  status: SystemHealthStatus;
};

export type AdminDashboardSnapshot = {
  eventName: string;
  appVersion: string;
  kpis: KpiDefinition[];
  charts: ChartDefinition[];
  inventory: InventoryTierSnapshot[];
  recentParticipants: RecentParticipant[];
  quickActions: QuickActionDefinition[];
  systemHealth: SystemHealthItem[];
};
