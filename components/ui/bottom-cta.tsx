"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Text } from "@/components/typography";

interface BottomCTAProps {
  title: string;
  description?: ReactNode;
  primaryLabel: string;
  onPrimaryClick?: () => void;
  primaryProps?: Omit<ButtonProps, "children" | "onClick">;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  className?: string;
}

export function BottomCTA({
  title,
  description,
  primaryLabel,
  onPrimaryClick,
  primaryProps,
  secondaryLabel,
  onSecondaryClick,
  className,
}: BottomCTAProps) {
  return (
    <div
      className={cn(
        "glass-panel safe-bottom fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-border/60 px-5 py-4 md:px-8",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--max-content)] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Text variant="heading" className="truncate text-base">
            {title}
          </Text>
          {description ? (
            <Text variant="caption" className="mt-0.5">
              {description}
            </Text>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {secondaryLabel ? (
            <Button variant="outline" onClick={onSecondaryClick}>
              {secondaryLabel}
            </Button>
          ) : null}
          <Button size="lg" onClick={onPrimaryClick} {...primaryProps}>
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
