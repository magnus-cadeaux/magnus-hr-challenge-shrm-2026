import type { ReactNode } from "react";
import { HeroTitle } from "@/components/ui/hero-title";
import { PageContainer } from "@/components/ui/page-container";
import { Subtitle } from "@/components/ui/subtitle";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface FeatureStageProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
  narrow?: boolean;
}

/**
 * Shared stage surface for feature routes.
 * Business logic is intentionally omitted in Sprint 0.
 */
export function FeatureStage({
  title,
  subtitle,
  eyebrow,
  children,
  className,
  narrow = false,
}: FeatureStageProps) {
  return (
    <PageContainer narrow={narrow} className={cn("flex flex-col gap-10", className)}>
      <div className="flex max-w-3xl flex-col gap-4">
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            {eyebrow}
          </span>
        ) : null}
        <HeroTitle>{title}</HeroTitle>
        <Subtitle>{subtitle}</Subtitle>
      </div>
      {children ? (
        <GlassCard className="w-full" padding="lg">
          {children}
        </GlassCard>
      ) : null}
    </PageContainer>
  );
}
