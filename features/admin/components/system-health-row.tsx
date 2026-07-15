"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { SystemHealthItem, SystemHealthStatus } from "../config/types";

const STATUS_DOT: Record<SystemHealthStatus, string> = {
  online: "bg-emerald-400",
  healthy: "bg-emerald-400",
  ready: "bg-blue-400",
  offline: "bg-rose-400",
  placeholder: "bg-amber-300/80",
};

interface SystemHealthRowProps {
  items: SystemHealthItem[];
}

export function SystemHealthRow({ items }: SystemHealthRowProps) {
  return (
    <Stack gap="md">
      <Text variant="heading" className="text-xl md:text-2xl">
        System Health
      </Text>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <GlassCard key={item.id} intensity="subtle" padding="md">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  STATUS_DOT[item.status],
                )}
                aria-hidden
              />
              <Text variant="micro" className="text-muted-foreground">
                {item.label}
              </Text>
            </div>
            <Text
              as="div"
              className={cn(
                "text-xl font-bold tracking-tight",
                item.status === "placeholder" && "text-amber-100/90",
              )}
            >
              {item.value}
            </Text>
          </GlassCard>
        ))}
      </div>
    </Stack>
  );
}
