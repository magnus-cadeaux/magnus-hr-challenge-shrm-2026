"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { InventoryTierSnapshot } from "../config/types";

interface InventoryTierCardProps {
  tier: InventoryTierSnapshot;
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "default" | "warn" | "muted";
}) {
  return (
    <div>
      <Text variant="micro" className="mb-1 text-muted-foreground">
        {label}
      </Text>
      <Text
        as="div"
        className={cn(
          "text-2xl font-extrabold tabular-nums tracking-tight",
          tone === "warn" && "text-amber-300",
          tone === "muted" && "text-blue-100/70",
        )}
      >
        {value}
      </Text>
    </div>
  );
}

export function InventoryTierCard({ tier }: InventoryTierCardProps) {
  const lowStock = tier.available <= tier.lowStockThreshold;
  const isPremium = tier.id === "premium_upgrade";

  return (
    <GlassCard
      intensity={lowStock ? "strong" : "default"}
      padding="lg"
      gradientBorder={isPremium}
      className={cn(
        "relative overflow-hidden",
        lowStock && "ring-1 ring-amber-400/30",
        isPremium && !lowStock && "ring-1 ring-achievement/25",
      )}
    >
      <div
        className={cn(
          "mb-5 flex items-start justify-between gap-3",
        )}
      >
        <div>
          <Text variant="eyebrow" className="mb-2 text-blue-200/70">
            Gift Inventory
          </Text>
          <Text
            variant="heading"
            className={cn(
              "text-2xl",
              isPremium && "text-gradient-gold",
            )}
          >
            {tier.label}
          </Text>
        </div>
        {lowStock ? (
          <span className="rounded-full bg-amber-400/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200">
            Low stock
          </span>
        ) : (
          <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
            Healthy
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Metric
          label="Available"
          value={tier.available}
          tone={lowStock ? "warn" : "default"}
        />
        <Metric label="Reserved" value={tier.reserved} tone="muted" />
        <Metric label="Distributed" value={tier.distributed} />
      </div>
    </GlassCard>
  );
}
