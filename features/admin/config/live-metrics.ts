import { getActiveEventDay } from "@/features/leaderboard/engine/event-day";
import { SIGNATURE_DEFINITIONS } from "@/features/signature/config/signatures";
import { getOfflineDatabase } from "@/services/storage/dexie";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import type {
  ChartDefinition,
  ChartPoint,
  ConversationStatus,
  KpiDefinition,
  RecentParticipant,
} from "./types";

function dayBounds(eventDay = getActiveEventDay()) {
  return {
    eventDay,
    start: `${eventDay}T00:00:00.000`,
    end: `${eventDay}T23:59:59.999`,
  };
}

function isOnEventDay(iso: string | null | undefined, eventDay: string): boolean {
  if (!iso) return false;
  return iso.slice(0, 10) === eventDay;
}

/** Challenge booth participants — exclude staff quick-scan contacts. */
function isQuizParticipant(source: unknown): boolean {
  if (source == null) return true;
  const value = String(source).trim().toLowerCase();
  if (!value) return true;
  return value !== "quick_scan";
}

function hourLabel(hour: number): string {
  if (hour === 0) return "12a";
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
}

function signatureName(id: string): string {
  return (
    SIGNATURE_DEFINITIONS.find((item) => item.id === id)?.name ??
    id.replace(/_/g, " ")
  );
}

function topN(
  counts: Map<string, number>,
  limit: number,
  labelFor: (id: string) => string,
): ChartPoint[] {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, value]) => ({
      id,
      label: labelFor(id),
      value,
    }));
}

function emptyHourPoints(): ChartPoint[] {
  return [9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => ({
    id: `h${String(hour).padStart(2, "0")}`,
    label: hourLabel(hour),
    value: 0,
  }));
}

function buildKpis(input: {
  participantsToday: number;
  completedChallenges: number;
  averageDurationMin: number;
  averageLeadScore: number;
  companiesRepresented: number;
  rewardsDistributed: number;
  premiumUpgrades: number;
}): KpiDefinition[] {
  const completionRate =
    input.participantsToday > 0
      ? (input.completedChallenges / input.participantsToday) * 100
      : 0;

  return [
    {
      id: "participants_today",
      label: "Participants Today",
      value: input.participantsToday,
    },
    {
      id: "completed_challenges",
      label: "Completed Challenges",
      value: input.completedChallenges,
    },
    {
      id: "completion_rate",
      label: "Completion Rate",
      value: completionRate,
      suffix: "%",
      decimals: 1,
    },
    {
      id: "average_duration",
      label: "Average Duration",
      value: input.averageDurationMin,
      suffix: " min",
      decimals: 1,
    },
    {
      id: "average_lead_score",
      label: "Average Lead Score",
      value: Math.round(input.averageLeadScore),
      achievement: true,
    },
    {
      id: "companies_represented",
      label: "Companies Represented",
      value: input.companiesRepresented,
    },
    {
      id: "rewards_distributed",
      label: "Rewards Distributed",
      value: input.rewardsDistributed,
      achievement: true,
    },
    {
      id: "premium_upgrades",
      label: "Premium Upgrades",
      value: input.premiumUpgrades,
      achievement: true,
    },
  ];
}

function buildCharts(input: {
  hourCounts: Map<number, number>;
  signatureCounts: Map<string, number>;
  industryCounts: Map<string, number>;
  priorityCounts: Map<string, number>;
}): ChartDefinition[] {
  const hourPoints = emptyHourPoints().map((point) => {
    const hour = Number(point.id.slice(1));
    return { ...point, value: input.hourCounts.get(hour) ?? 0 };
  });

  const signatureTop = topN(input.signatureCounts, 5, signatureName);
  const industryTop = topN(input.industryCounts, 5, (id) => id);
  const priorityTop = topN(input.priorityCounts, 5, (id) => id);

  return [
    {
      id: "participants_per_hour",
      title: "Participants per Hour",
      subtitle: "Booth traffic since open",
      kind: "vertical",
      points: hourPoints,
    },
    {
      id: "top_signatures",
      title: "Top HR Signatures",
      subtitle: "Distribution live today",
      kind: "horizontal",
      points:
        signatureTop.length > 0
          ? signatureTop
          : SIGNATURE_DEFINITIONS.slice(0, 5).map((item) => ({
              id: item.id,
              label: item.name,
              value: 0,
            })),
    },
    {
      id: "top_industries",
      title: "Top Company Industries",
      subtitle: "Organisations on the floor",
      kind: "horizontal",
      points:
        industryTop.length > 0
          ? industryTop
          : [{ id: "none", label: "No industry data yet", value: 0 }],
    },
    {
      id: "top_priorities",
      title: "Most Selected Priorities",
      subtitle: "Inferred sales signals",
      kind: "horizontal",
      points:
        priorityTop.length > 0
          ? priorityTop
          : [{ id: "none", label: "No priority signals yet", value: 0 }],
    },
  ];
}

function formatClock(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

type MetricsBundle = {
  kpis: KpiDefinition[];
  charts: ChartDefinition[];
  recentParticipants: RecentParticipant[];
};

function normalizeStatus(value: unknown): ConversationStatus {
  const status = String(value ?? "pending");
  if (
    status === "pending" ||
    status === "in_progress" ||
    status === "complete"
  ) {
    return status;
  }
  return "pending";
}

async function loadFromSupabase(): Promise<MetricsBundle | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;

  const { start, end } = dayBounds();

  const [
    participantsRes,
    sessionsRes,
    signaturesRes,
    salesRes,
    rewardsRes,
    companiesRes,
  ] = await Promise.all([
    client
      .from("participants")
      .select(
        "id, full_name, company_name, source, local_session_id, created_at, started_at, completed_at",
      )
      .gte("created_at", start)
      .lte("created_at", end),
    client
      .from("challenge_sessions")
      .select(
        "id, status, elapsed_ms, completed_at, started_at, local_session_id",
      )
      .eq("status", "completed")
      .gte("completed_at", start)
      .lte("completed_at", end),
    client
      .from("signature_profiles")
      .select(
        "id, primary_signature_id, local_session_id, created_at",
      )
      .gte("created_at", start)
      .lte("created_at", end),
    client
      .from("sales_profiles")
      .select(
        "id, lead_score, conversation_status, local_session_id, profile, created_at",
      )
      .gte("created_at", start)
      .lte("created_at", end),
    client
      .from("rewards")
      .select(
        "id, gift_name, tier, upgraded, local_session_id, assigned_at, created_at",
      )
      .gte("assigned_at", start)
      .lte("assigned_at", end),
    client.from("companies").select("id, name, industry"),
  ]);

  if (
    participantsRes.error ||
    sessionsRes.error ||
    signaturesRes.error ||
    salesRes.error ||
    rewardsRes.error
  ) {
    return null;
  }

  const participants = (participantsRes.data ?? []).filter((row) =>
    isQuizParticipant(row.source),
  );
  const sessions = sessionsRes.data ?? [];
  const signatures = signaturesRes.data ?? [];
  const sales = salesRes.data ?? [];
  const rewards = rewardsRes.data ?? [];
  const companies = companiesRes.data ?? [];

  const companyIndustry = new Map<string, string>();
  for (const company of companies) {
    const name = String(company.name ?? "").trim().toLowerCase();
    const industry = String(company.industry ?? "").trim();
    if (name && industry) companyIndustry.set(name, industry);
  }

  const hourCounts = new Map<number, number>();
  const companiesSet = new Set<string>();
  for (const row of participants) {
    const created = row.created_at ?? row.started_at;
    if (created) {
      const hour = new Date(created).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    }
    const company = String(row.company_name ?? "").trim();
    if (company) companiesSet.add(company.toLowerCase());
  }

  const elapsedValues = sessions
    .map((row) =>
      typeof row.elapsed_ms === "number" && row.elapsed_ms > 0
        ? row.elapsed_ms
        : null,
    )
    .filter((value): value is number => value != null);

  const leadScores = sales
    .map((row) => (typeof row.lead_score === "number" ? row.lead_score : null))
    .filter((value): value is number => value != null);

  const signatureCounts = new Map<string, number>();
  for (const row of signatures) {
    const id = String(row.primary_signature_id ?? "");
    if (!id) continue;
    signatureCounts.set(id, (signatureCounts.get(id) ?? 0) + 1);
  }

  const industryCounts = new Map<string, number>();
  for (const row of participants) {
    const company = String(row.company_name ?? "").trim().toLowerCase();
    const industry = companyIndustry.get(company);
    if (!industry) continue;
    industryCounts.set(industry, (industryCounts.get(industry) ?? 0) + 1);
  }

  const priorityCounts = new Map<string, number>();
  for (const row of sales) {
    const profile = row.profile as
      | { likelyPriorities?: Array<{ id?: string; label?: string }> }
      | null;
    for (const item of profile?.likelyPriorities?.slice(0, 3) ?? []) {
      const label = String(item.label ?? item.id ?? "").trim();
      if (!label) continue;
      priorityCounts.set(label, (priorityCounts.get(label) ?? 0) + 1);
    }
  }

  const premiumUpgrades = rewards.filter(
    (row) => row.upgraded === true || row.tier === "premium_upgrade",
  ).length;

  const signatureBySession = new Map(
    signatures.map((row) => [String(row.local_session_id ?? ""), row]),
  );
  const salesBySession = new Map(
    sales.map((row) => [String(row.local_session_id ?? ""), row]),
  );
  const rewardBySession = new Map(
    rewards.map((row) => [String(row.local_session_id ?? ""), row]),
  );
  const sessionByLocal = new Map(
    sessions.map((row) => [String(row.local_session_id ?? ""), row]),
  );

  const recentParticipants: RecentParticipant[] = [...participants]
    .sort((a, b) =>
      String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")),
    )
    .slice(0, 10)
    .map((row) => {
      const sessionId = String(row.local_session_id ?? "");
      const signature = signatureBySession.get(sessionId);
      const sale = salesBySession.get(sessionId);
      const reward = rewardBySession.get(sessionId);
      const session = sessionByLocal.get(sessionId);
      return {
        id: String(row.id),
        name: String(row.full_name ?? "Participant"),
        company: String(row.company_name ?? "—"),
        signature: signature
          ? signatureName(String(signature.primary_signature_id))
          : "—",
        gift: reward ? String(reward.gift_name ?? "—") : "—",
        leadScore:
          typeof sale?.lead_score === "number" ? Math.round(sale.lead_score) : 0,
        conversationStatus: normalizeStatus(sale?.conversation_status),
        completedAt: formatClock(
          row.completed_at ?? session?.completed_at ?? row.created_at,
        ),
      };
    });

  return {
    kpis: buildKpis({
      participantsToday: participants.length,
      completedChallenges: sessions.length,
      averageDurationMin: average(elapsedValues) / 60_000,
      averageLeadScore: average(leadScores),
      companiesRepresented: companiesSet.size,
      rewardsDistributed: rewards.length,
      premiumUpgrades,
    }),
    charts: buildCharts({
      hourCounts,
      signatureCounts,
      industryCounts,
      priorityCounts,
    }),
    recentParticipants,
  };
}

async function loadFromDexie(): Promise<MetricsBundle> {
  const { eventDay } = dayBounds();
  const db = getOfflineDatabase();
  const rows = await db.sessions.toArray();

  const participants = rows.filter(
    (row) =>
      row.id.startsWith("participants:") &&
      isQuizParticipant(row.payload.source) &&
      isOnEventDay(
        (typeof row.payload.created_at === "string" &&
          row.payload.created_at) ||
          (typeof row.payload.started_at === "string" &&
            row.payload.started_at) ||
          row.createdAt ||
          row.updatedAt,
        eventDay,
      ),
  );

  const sessions = rows.filter(
    (row) =>
      row.id.startsWith("challenge_sessions:") &&
      row.payload.status === "completed" &&
      isOnEventDay(
        typeof row.payload.completed_at === "string"
          ? row.payload.completed_at
          : row.updatedAt,
        eventDay,
      ),
  );

  const signatures = rows.filter(
    (row) =>
      row.id.startsWith("signature_profiles:") &&
      isOnEventDay(
        typeof row.payload.created_at === "string"
          ? row.payload.created_at
          : row.createdAt || row.updatedAt,
        eventDay,
      ),
  );

  const sales = rows.filter(
    (row) =>
      row.id.startsWith("sales_profiles:") &&
      isOnEventDay(
        typeof row.payload.created_at === "string"
          ? row.payload.created_at
          : row.createdAt || row.updatedAt,
        eventDay,
      ),
  );

  const rewards = rows.filter(
    (row) =>
      row.id.startsWith("rewards:") &&
      isOnEventDay(
        (typeof row.payload.assigned_at === "string" &&
          row.payload.assigned_at) ||
          (typeof row.payload.created_at === "string" &&
            row.payload.created_at) ||
          row.createdAt ||
          row.updatedAt,
        eventDay,
      ),
  );

  const hourCounts = new Map<number, number>();
  const companiesSet = new Set<string>();
  for (const row of participants) {
    const created =
      (typeof row.payload.created_at === "string" && row.payload.created_at) ||
      (typeof row.payload.started_at === "string" && row.payload.started_at) ||
      row.createdAt ||
      row.updatedAt;
    if (created) {
      const hour = new Date(created).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    }
    const company = String(row.payload.company_name ?? "").trim();
    if (company) companiesSet.add(company.toLowerCase());
  }

  const elapsedValues = sessions
    .map((row) =>
      typeof row.payload.elapsed_ms === "number" && row.payload.elapsed_ms > 0
        ? row.payload.elapsed_ms
        : null,
    )
    .filter((value): value is number => value != null);

  const leadScores = sales
    .map((row) =>
      typeof row.payload.lead_score === "number" ? row.payload.lead_score : null,
    )
    .filter((value): value is number => value != null);

  const signatureCounts = new Map<string, number>();
  for (const row of signatures) {
    const id = String(row.payload.primary_signature_id ?? "");
    if (!id) continue;
    signatureCounts.set(id, (signatureCounts.get(id) ?? 0) + 1);
  }

  const priorityCounts = new Map<string, number>();
  for (const row of sales) {
    const profile = row.payload.profile as
      | { likelyPriorities?: Array<{ id?: string; label?: string }> }
      | undefined;
    for (const item of profile?.likelyPriorities?.slice(0, 3) ?? []) {
      const label = String(item.label ?? item.id ?? "").trim();
      if (!label) continue;
      priorityCounts.set(label, (priorityCounts.get(label) ?? 0) + 1);
    }
  }

  const premiumUpgrades = rewards.filter(
    (row) =>
      row.payload.upgraded === true ||
      row.payload.tier === "premium_upgrade",
  ).length;

  const signatureBySession = new Map(
    signatures.map((row) => [
      String(row.payload.local_session_id ?? ""),
      row.payload,
    ]),
  );
  const salesBySession = new Map(
    sales.map((row) => [
      String(row.payload.local_session_id ?? ""),
      row.payload,
    ]),
  );
  const rewardBySession = new Map(
    rewards.map((row) => [
      String(row.payload.local_session_id ?? ""),
      row.payload,
    ]),
  );
  const sessionByLocal = new Map(
    sessions.map((row) => [
      String(row.payload.local_session_id ?? ""),
      row.payload,
    ]),
  );

  const recentParticipants: RecentParticipant[] = [...participants]
    .sort((a, b) =>
      String(b.createdAt || b.updatedAt).localeCompare(
        String(a.createdAt || a.updatedAt),
      ),
    )
    .slice(0, 10)
    .map((row, index) => {
      const sessionId = String(row.payload.local_session_id ?? "");
      const signature = signatureBySession.get(sessionId);
      const sale = salesBySession.get(sessionId);
      const reward = rewardBySession.get(sessionId);
      const session = sessionByLocal.get(sessionId);
      return {
        id: `local-${index}-${sessionId || row.id}`,
        name: String(row.payload.full_name ?? "Participant"),
        company: String(row.payload.company_name ?? "—"),
        signature: signature
          ? signatureName(String(signature.primary_signature_id))
          : "—",
        gift: reward ? String(reward.gift_name ?? "—") : "—",
        leadScore:
          typeof sale?.lead_score === "number"
            ? Math.round(Number(sale.lead_score))
            : 0,
        conversationStatus: normalizeStatus(sale?.conversation_status),
        completedAt: formatClock(
          (typeof row.payload.completed_at === "string" &&
            row.payload.completed_at) ||
            (typeof session?.completed_at === "string" &&
              session.completed_at) ||
            row.updatedAt,
        ),
      };
    });

  return {
    kpis: buildKpis({
      participantsToday: participants.length,
      completedChallenges: sessions.length,
      averageDurationMin: average(elapsedValues) / 60_000,
      averageLeadScore: average(leadScores),
      companiesRepresented: companiesSet.size,
      rewardsDistributed: rewards.length,
      premiumUpgrades,
    }),
    charts: buildCharts({
      hourCounts,
      signatureCounts,
      industryCounts: new Map(),
      priorityCounts,
    }),
    recentParticipants,
  };
}

/** Load live admin KPIs, charts, and recent participants (Supabase → Dexie). */
export async function loadLiveAdminMetrics(): Promise<MetricsBundle> {
  if (isSupabaseConfigured()) {
    try {
      const remote = await loadFromSupabase();
      if (remote) return remote;
    } catch {
      /* fall through to Dexie */
    }
  }
  return loadFromDexie();
}
