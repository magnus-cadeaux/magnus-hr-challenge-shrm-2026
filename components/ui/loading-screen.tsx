"use client";

import { m } from "framer-motion";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/typography";

export interface LoadingScreenProps {
  label?: string;
  className?: string;
  fullScreen?: boolean;
  variant?: "brand" | "minimal";
}

export function LoadingScreen({
  label = "Preparing your experience",
  className,
  fullScreen = true,
  variant = "brand",
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        fullScreen && "fixed inset-0 z-[var(--z-overlay)] bg-navy-950/90 backdrop-blur-xl",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {variant === "brand" ? (
        <div className="relative flex size-16 items-center justify-center">
          <m.div
            className="absolute inset-0 rounded-full border border-blue-400/30"
            animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <m.div
            className="size-10 rounded-full bg-gradient-blue shadow-glow"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <Spinner size="lg" />
      )}
      <div className="text-center">
        {variant === "brand" ? (
          <Text variant="caption" className="tracking-wide text-foreground">
            {APP_NAME}
          </Text>
        ) : null}
        <Text variant="body-sm" className="mt-1">
          {label}
        </Text>
      </div>
    </div>
  );
}
