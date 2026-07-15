"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  suffix?: string;
  prefix?: string;
  description?: ReactNode;
  achievement?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  suffix,
  prefix,
  description,
  achievement = false,
  className,
}: StatCardProps) {
  return (
    <GlassCard lift className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              achievement
                ? "bg-achievement/15 text-achievement"
                : "bg-primary/15 text-blue-300",
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
        ) : null}
      </div>
      <AnimatedCounter
        value={value}
        prefix={prefix}
        suffix={suffix}
        className={cn(
          "text-3xl font-extrabold tracking-tight md:text-4xl",
          achievement ? "text-gradient-gold" : "text-foreground",
        )}
      />
      {description ? (
        <div className="text-sm leading-relaxed text-muted-foreground">{description}</div>
      ) : null}
    </GlassCard>
  );
}
