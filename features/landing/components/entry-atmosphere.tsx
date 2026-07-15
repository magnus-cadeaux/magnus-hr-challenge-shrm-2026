"use client";

import { m } from "framer-motion";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { GradientBackground } from "@/components/ui/gradient-background";
import { cn } from "@/lib/utils";
import { durations, easings } from "@/lib/design-system/motion";

interface EntryAtmosphereProps {
  phase: "idle" | "transitioning" | "welcome";
  reduceMotion?: boolean;
}

export function EntryAtmosphere({
  phase,
  reduceMotion = false,
}: EntryAtmosphereProps) {
  const accelerating = phase === "transitioning";
  const darkened = phase === "transitioning" || phase === "welcome";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <GradientBackground variant="hero" withOrb={false} />

      <m.div
        className="absolute -left-[20%] top-[-10%] size-[48rem] rounded-full bg-blue-500/20 blur-3xl"
        animate={
          reduceMotion
            ? { opacity: 0.35 }
            : {
                x: [0, 60, -20, 0],
                y: [0, 30, -40, 0],
                opacity: [0.28, 0.42, 0.3, 0.28],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: accelerating ? 2.4 : 18,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        style={{ willChange: "transform, opacity" }}
      />

      <m.div
        className="absolute -right-[15%] bottom-[-20%] size-[42rem] rounded-full bg-cyan-400/15 blur-3xl"
        animate={
          reduceMotion
            ? { opacity: 0.25 }
            : {
                x: [0, -50, 30, 0],
                y: [0, -35, 25, 0],
                opacity: [0.2, 0.34, 0.22, 0.2],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: accelerating ? 2 : 22,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        style={{ willChange: "transform, opacity" }}
      />

      <m.div
        className="absolute left-1/2 top-1/3 size-[36rem] -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl"
        animate={
          reduceMotion
            ? { opacity: 0.18 }
            : {
                scale: [1, 1.12, 1],
                opacity: [0.14, 0.28, 0.14],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: accelerating ? 1.6 : 14,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        style={{ willChange: "transform, opacity" }}
      />

      <div className="glass-subtle absolute inset-0 border-0 bg-navy-950/20" />

      <FloatingParticles
        density={accelerating ? "dense" : "default"}
        tone="mixed"
        className={cn(accelerating && "opacity-90")}
      />

      <m.div
        className="absolute inset-0 bg-navy-950"
        initial={false}
        animate={{ opacity: darkened ? 0.42 : 0 }}
        transition={{ duration: durations.reveal, ease: easings.outExpo }}
        style={{ willChange: "opacity" }}
      />
    </div>
  );
}
