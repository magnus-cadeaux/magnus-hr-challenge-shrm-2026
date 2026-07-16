"use client";

import { useState } from "react";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/branding/magnus-logo.png";

export type BrandMarkSize = "sm" | "md" | "lg" | "hero";

const SIZE_CLASS: Record<BrandMarkSize, string> = {
  sm: "h-8 w-auto md:h-9",
  md: "h-11 w-auto md:h-12",
  lg: "h-16 w-auto md:h-20",
  hero: "h-28 w-auto md:h-36",
};

interface BrandMarkProps {
  size?: BrandMarkSize;
  className?: string;
  /** Prefer decorative when a nearby heading already names the brand. */
  decorative?: boolean;
  priority?: boolean;
}

/**
 * Shared Magnus wordmark. Renders the brand logo with a text fallback
 * if the image fails to load.
 */
export function BrandMark({
  size = "md",
  className,
  decorative = false,
  priority = false,
}: BrandMarkProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "font-display font-bold tracking-tight text-gradient-blue",
          size === "sm" && "text-base md:text-lg",
          size === "md" && "text-xl md:text-2xl",
          size === "lg" && "text-3xl md:text-4xl",
          size === "hero" && "text-4xl md:text-5xl",
          className,
        )}
        aria-hidden={decorative || undefined}
      >
        {APP_NAME}
      </span>
    );
  }

  return (
    <Image
      src={LOGO_SRC}
      alt={decorative ? "" : APP_NAME}
      width={329}
      height={434}
      priority={priority}
      aria-hidden={decorative || undefined}
      onError={() => setFailed(true)}
      className={cn(
        "object-contain object-left",
        SIZE_CLASS[size],
        className,
      )}
    />
  );
}
