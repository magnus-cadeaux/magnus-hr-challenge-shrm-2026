"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { GradientBackground } from "@/components/ui/gradient-background";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { PageContainer } from "@/components/ui/page-container";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { useMediaQuery } from "@/hooks/use-media-query";
import { durations, easings } from "@/lib/design-system/motion";
import { useLiveArena } from "../hooks/use-live-arena";
import type { ArenaTab } from "../engine/types";
import { ArenaTabs } from "./arena-tabs";
import { IndividualRankings } from "./individual-rankings";
import { CompanyRankings } from "./company-rankings";
import { SignatureDistribution } from "./signature-distribution";
import { SideStats } from "./side-stats";
import { QuoteTicker } from "./quote-ticker";
import { SpecialMomentOverlay } from "./special-moment-overlay";

export function ArenaExperience() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const snapshot = useLiveArena(true);
  const [tab, setTab] = useState<ArenaTab>("individuals");

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <VisuallyHidden>
        <h1>Today&apos;s HR Arena</h1>
      </VisuallyHidden>

      <GradientBackground variant="hero" withOrb />
      <div className="pointer-events-none absolute inset-0 bg-navy-950/40" />
      <FloatingParticles density="sparse" tone="mixed" className="opacity-40" />

      <SpecialMomentOverlay
        moment={snapshot.moment}
        reduceMotion={reduceMotion}
      />

      <PageContainer className="relative z-10 py-8 md:py-12">
        <Stack gap="xl" className="pb-10">
          <Stack gap="sm" align="center" className="text-center">
            <Text variant="display" gradient="blue" className="tracking-tight">
              Today&apos;s HR Arena
            </Text>
            <Text
              variant="subtitle"
              className="max-w-2xl text-lg text-blue-100/75 md:text-xl"
            >
              Live rankings from today&apos;s Magnus HR Challenge
            </Text>
            <div className="pt-4">
              <ArenaTabs value={tab} onChange={setTab} />
            </div>
          </Stack>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <m.div
                  key={tab}
                  initial={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }
                  }
                  transition={{
                    duration: reduceMotion ? durations.fast : durations.base,
                    ease: easings.outExpo,
                  }}
                  style={{ willChange: "transform, opacity" }}
                >
                  {tab === "individuals" ? (
                    <IndividualRankings
                      entries={snapshot.individuals}
                      reduceMotion={reduceMotion}
                    />
                  ) : null}
                  {tab === "companies" ? (
                    <CompanyRankings
                      entries={snapshot.companies}
                      reduceMotion={reduceMotion}
                    />
                  ) : null}
                  {tab === "signatures" ? (
                    <SignatureDistribution
                      entries={snapshot.signatures}
                      reduceMotion={reduceMotion}
                    />
                  ) : null}
                </m.div>
              </AnimatePresence>
            </div>

            <aside className="xl:sticky xl:top-8">
              <SideStats stats={snapshot.stats} />
            </aside>
          </div>

          <div className="border-t border-white/10 pt-8">
            <QuoteTicker reduceMotion={reduceMotion} />
          </div>
        </Stack>
      </PageContainer>
    </div>
  );
}
