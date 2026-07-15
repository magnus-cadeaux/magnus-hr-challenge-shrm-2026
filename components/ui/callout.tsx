import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/layout/surface";
import { Text } from "@/components/typography";

export interface CalloutProps {
  title?: string;
  children: ReactNode;
  icon?: LucideIcon;
  tone?: "default" | "info" | "success" | "warning" | "destructive" | "achievement";
  className?: string;
}

const toneStyles = {
  default: "border-border",
  info: "border-blue-400/25 bg-blue-500/10",
  success: "border-success/25 bg-success/10",
  warning: "border-warning/25 bg-warning/10",
  destructive: "border-destructive/25 bg-destructive/10",
  achievement: "border-achievement/30 bg-achievement/10",
} as const;

const iconTone = {
  default: "text-blue-300",
  info: "text-blue-300",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  achievement: "text-achievement",
} as const;

export function Callout({
  title,
  children,
  icon: Icon,
  tone = "default",
  className,
}: CalloutProps) {
  return (
    <Surface
      variant="glass-subtle"
      padding="md"
      className={cn("flex gap-4", toneStyles[tone], className)}
    >
      {Icon ? (
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5",
            iconTone[tone],
          )}
        >
          <Icon className="size-4" aria-hidden />
        </div>
      ) : null}
      <div className="min-w-0 space-y-1">
        {title ? (
          <Text variant="heading" className="text-base">
            {title}
          </Text>
        ) : null}
        <Text variant="body-sm" className="text-pretty">
          {children}
        </Text>
      </div>
    </Surface>
  );
}
