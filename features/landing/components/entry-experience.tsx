"use client";

import { AnimatePresence, m } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { durations, easings } from "@/lib/design-system/motion";
import { useEntryPhase } from "../hooks/use-entry-phase";
import { EntryAtmosphere } from "./entry-atmosphere";
import { IdleExperience } from "./idle-experience";
import { WelcomeExperience } from "./welcome-experience";

export function EntryExperience() {
  const { phase, isIdle, isTransitioning, isWelcome, beginTransition } =
    useEntryPhase();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy-950">
      <VisuallyHidden>
        <h1>Magnus HR Challenge · SHRM Hyderabad 2026</h1>
      </VisuallyHidden>

      <EntryAtmosphere phase={phase} reduceMotion={reduceMotion} />

      <AnimatePresence mode="wait">
        {(isIdle || isTransitioning) && (
          <m.div
            key="idle"
            className="absolute inset-0"
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.06, filter: "blur(10px)" }
            }
            transition={{
              duration: reduceMotion ? durations.fast : durations.base,
              ease: easings.outExpo,
            }}
            style={{ willChange: "transform, opacity, filter" }}
          >
            <IdleExperience
              frozen={isTransitioning}
              reduceMotion={reduceMotion}
              onBegin={beginTransition}
            />
          </m.div>
        )}

        {isWelcome && (
          <m.div
            key="welcome"
            className="absolute inset-0"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, filter: "blur(8px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: reduceMotion ? durations.fast : durations.slow,
              ease: easings.outExpo,
            }}
            style={{ willChange: "transform, opacity, filter" }}
          >
            <WelcomeExperience reduceMotion={reduceMotion} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
