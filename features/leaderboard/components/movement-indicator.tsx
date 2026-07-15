"use client";

import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RankMovement } from "../engine/types";

interface MovementIndicatorProps {
  movement: RankMovement;
  className?: string;
}

export function MovementIndicator({
  movement,
  className,
}: MovementIndicatorProps) {
  if (movement === "up") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-emerald-300",
          className,
        )}
        aria-label="Moved up"
      >
        <ArrowUp className="size-5" aria-hidden />
      </span>
    );
  }

  if (movement === "down") {
    return (
      <span
        className={cn("inline-flex items-center gap-1 text-rose-300/90", className)}
        aria-label="Moved down"
      >
        <ArrowDown className="size-5" aria-hidden />
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-blue-200/50", className)}
      aria-label="Unchanged"
    >
      <ArrowRight className="size-5" aria-hidden />
    </span>
  );
}
