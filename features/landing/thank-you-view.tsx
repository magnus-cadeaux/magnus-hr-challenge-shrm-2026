"use client";

import { BrandMark } from "@/components/ui/brand-mark";
import { HeroTitle } from "@/components/ui/hero-title";
import { PageContainer } from "@/components/ui/page-container";
import { Subtitle } from "@/components/ui/subtitle";

export function ThankYouView() {
  return (
    <PageContainer narrow className="flex flex-col gap-10">
      <div className="flex max-w-3xl flex-col gap-4">
        <BrandMark size="lg" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
          Complete
        </span>
        <HeroTitle>Thank you</HeroTitle>
        <Subtitle>
          Your Magnus HR Challenge journey is complete. We appreciate your
          leadership.
        </Subtitle>
      </div>
    </PageContainer>
  );
}
