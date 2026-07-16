"use client";

import { useCallback, useEffect, useState } from "react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { PageContainer } from "@/components/ui/page-container";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  buildAdminDashboardSnapshot,
  loadAdminDashboardSnapshot,
} from "../config";
import type {
  AdminDashboardSnapshot,
  SystemHealthItem,
} from "../config/types";
import { AdminHeader } from "./admin-header";
import { KpiRow } from "./kpi-row";
import { ChartsRow } from "./charts-row";
import { InventoryRow } from "./inventory-row";
import { OperationsRow } from "./operations-row";
import { QuickActionsRow } from "./quick-actions-row";
import { SystemHealthRow } from "./system-health-row";
import { QuestionBankManager } from "../question-bank";

type AdminTab = "operations" | "questions";

function withLiveInternet(items: SystemHealthItem[]): SystemHealthItem[] {
  const online =
    typeof navigator !== "undefined" ? navigator.onLine : true;
  return items.map((item) =>
    item.id === "internet"
      ? {
          ...item,
          value: online ? "Online" : "Offline",
          status: online ? "online" : "offline",
        }
      : item,
  );
}

export function CommandCenter() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [base, setBase] = useState<AdminDashboardSnapshot>(() =>
    buildAdminDashboardSnapshot(),
  );
  const [systemHealth, setSystemHealth] = useState(() =>
    withLiveInternet(base.systemHealth),
  );
  const [tab, setTab] = useState<AdminTab>("operations");
  const [loading, setLoading] = useState(true);

  const refreshDashboard = useCallback(async () => {
    const next = await loadAdminDashboardSnapshot();
    setBase(next);
    setSystemHealth(withLiveInternet(next.systemHealth));
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await refreshDashboard();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshDashboard]);

  useEffect(() => {
    setSystemHealth(withLiveInternet(base.systemHealth));
  }, [base.systemHealth]);

  useEffect(() => {
    const sync = () => setSystemHealth(withLiveInternet(base.systemHealth));
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, [base.systemHealth]);

  if (loading) {
    return <LoadingScreen label="Loading live dashboard" />;
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <VisuallyHidden>
        <h1>Magnus HR Challenge Control Center</h1>
      </VisuallyHidden>

      <GradientBackground variant="arena" withOrb />
      <div className="pointer-events-none absolute inset-0 bg-navy-950/50" />

      <PageContainer className="relative z-10 py-8 md:py-12">
        <Stack gap="2xl" className="mx-auto max-w-7xl pb-16">
          <AdminHeader eventName={base.eventName} />

          <div
            role="tablist"
            aria-label="Admin sections"
            className="inline-flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5"
          >
            {(
              [
                { id: "operations", label: "Operations" },
                { id: "questions", label: "Question Bank" },
              ] as const
            ).map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "rounded-xl px-5 py-3 text-sm font-semibold transition-colors md:text-base",
                    active
                      ? "bg-gradient-blue text-white shadow-lg shadow-blue-500/20"
                      : "text-blue-100/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === "operations" ? (
            <Stack gap="2xl">
              <KpiRow kpis={base.kpis} />
              <ChartsRow charts={base.charts} reduceMotion={reduceMotion} />
              <InventoryRow inventory={base.inventory} />
              <OperationsRow participants={base.recentParticipants} />
              <QuickActionsRow
                actions={base.quickActions}
                onDataChange={() => {
                  void refreshDashboard();
                }}
              />
              <SystemHealthRow items={systemHealth} />
            </Stack>
          ) : (
            <Stack gap="lg">
              <Text variant="subtitle" className="max-w-2xl">
                Manage the live challenge bank. Blank by default — import or
                author questions. Active questions power participant sessions
                when the local bank has entries.
              </Text>
              <QuestionBankManager />
            </Stack>
          )}
        </Stack>
      </PageContainer>
    </div>
  );
}
