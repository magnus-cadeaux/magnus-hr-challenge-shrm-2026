"use client";

import { m } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/utils/device";
import { useMounted } from "@/hooks/use-mounted";
import { colors } from "@/lib/design-system/tokens";

export interface FloatingParticlesProps {
  count?: number;
  className?: string;
  tone?: "blue" | "mixed" | "gold";
  density?: "sparse" | "default" | "dense";
}

const densityCount = {
  sparse: 12,
  default: 24,
  dense: 40,
} as const;

export function FloatingParticles({
  count,
  className,
  tone = "blue",
  density = "default",
}: FloatingParticlesProps) {
  const mounted = useMounted();
  const particleCount = count ?? densityCount[density];

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => {
        const palette =
          tone === "gold"
            ? [colors.gold[400], colors.gold[300], colors.blue[400]]
            : tone === "mixed"
              ? [colors.blue[400], colors.cyan[400], colors.blue[300]]
              : [colors.blue[300], colors.blue[400], colors.cyan[400]];

        return {
          id: index,
          left: `${(index * 37) % 100}%`,
          top: `${(index * 53) % 100}%`,
          size: 2 + (index % 4),
          duration: 8 + (index % 7),
          delay: (index % 5) * 0.4,
          opacity: 0.12 + (index % 5) * 0.04,
          color: palette[index % palette.length],
        };
      }),
    [particleCount, tone],
  );

  if (!mounted || prefersReducedMotion()) {
    return null;
  }

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {particles.map((particle) => (
        <m.span
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            backgroundColor: particle.color,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 8, 0],
            opacity: [particle.opacity, particle.opacity * 1.6, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
