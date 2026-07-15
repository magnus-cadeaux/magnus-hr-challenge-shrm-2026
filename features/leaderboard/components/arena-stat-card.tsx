"use client";

import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { LiveValue } from "./live-value";

interface ArenaStatCardProps {
  label: string;
  value?: number;
  display?: string;
  icon?: LucideIcon;
  suffix?: string;
  decimals?: number;
  description?: string;
  achievement?: boolean;
  className?: string;
}

/** Large, booth-readable stat card for the live arena side panel. */
export function ArenaStatCard({
  label,
  value,
  display,
  icon: Icon,
  suffix,
  decimals = 0,
  description,
  achievement = false,
  className,
}: ArenaStatCardProps) {
  return (
    <GlassCard
      intensity="default"
      padding="md"
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <Text variant="micro" className="text-muted-foreground">
          {label}
        </Text>
        {Icon ? (
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              achievement
                ? "bg-achievement/15 text-achievement"
                : "bg-primary/15 text-blue-300",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </div>
        ) : null}
      </div>
      {display ? (
        <Text
          as="div"
          className={cn(
            "text-xl font-extrabold tracking-tight md:text-2xl",
            achievement ? "text-gradient-gold" : "text-foreground",
          )}
        >
          {display}
        </Text>
      ) : (
        <LiveValue
          value={value ?? 0}
          decimals={decimals}
          suffix={suffix}
          className={cn(
            "text-3xl font-extrabold tracking-tight md:text-4xl",
            achievement ? "text-gradient-gold" : "text-foreground",
          )}
        />
      )}
      {description ? (
        <Text variant="caption" className="text-sm leading-snug">
          {description}
        </Text>
      ) : null}
    </GlassCard>
  );
}
