"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroTitle } from "@/components/ui/hero-title";
import { PageContainer } from "@/components/ui/page-container";
import { Subtitle } from "@/components/ui/subtitle";
import { GlassCard } from "@/components/ui/glass-card";
import { heroReveal } from "@/animations/hero";
import { APP_NAME, APP_TAGLINE, EVENT_NAME, ROUTES } from "@/lib/constants";

export function LandingView() {
  return (
    <PageContainer className="flex flex-col justify-center gap-12 py-16 md:py-24">
      <m.div
        variants={heroReveal.container}
        initial="hidden"
        animate="visible"
        className="flex max-w-3xl flex-col gap-6"
      >
        <m.p
          variants={heroReveal.item}
          className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300"
        >
          {EVENT_NAME}
        </m.p>
        <HeroTitle className="text-[length:var(--text-display)]">{APP_NAME}</HeroTitle>
        <Subtitle>{APP_TAGLINE}</Subtitle>
        <m.div variants={heroReveal.item} className="flex flex-wrap items-center gap-4 pt-2">
          <Button asChild size="xl">
            <Link href={ROUTES.register}>
              Begin experience
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={ROUTES.leaderboard}>View leaderboard</Link>
          </Button>
        </m.div>
      </m.div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Senior audience",
            body: "Crafted for CHROs, HR Heads, and people leaders.",
          },
          {
            title: "Premium flow",
            body: "From registration to reward—designed as one continuous experience.",
          },
          {
            title: "Exhibition ready",
            body: "Optimized for iPad kiosks and high-touch event floors.",
          },
        ].map((item) => (
          <GlassCard key={item.title} lift>
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </GlassCard>
        ))}
      </div>
    </PageContainer>
  );
}
