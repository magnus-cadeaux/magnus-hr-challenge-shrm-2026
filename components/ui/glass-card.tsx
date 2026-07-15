"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import * as React from "react";
import { glassHover } from "@/animations/glass";
import { cardLift } from "@/animations/card";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  intensity?: "subtle" | "default" | "strong" | "panel";
  lift?: boolean;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  gradientBorder?: boolean;
}

const intensityMap = {
  subtle: "glass-subtle",
  default: "glass",
  strong: "glass-strong",
  panel: "glass-panel",
} as const;

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-[var(--space-card)]",
  lg: "p-[var(--space-card-lg)] md:p-10",
  xl: "p-10 md:p-12",
} as const;

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      intensity = "default",
      lift = false,
      interactive = false,
      padding = "md",
      gradientBorder = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <m.div
        ref={ref}
        className={cn(
          "rounded-2xl",
          gradientBorder ? "glass-border-gradient" : intensityMap[intensity],
          interactive && "glass-interactive",
          paddingMap[padding],
          className,
        )}
        {...(lift ? cardLift.motion : interactive ? glassHover : {})}
        {...props}
      >
        {children}
      </m.div>
    );
  },
);
GlassCard.displayName = "GlassCard";
