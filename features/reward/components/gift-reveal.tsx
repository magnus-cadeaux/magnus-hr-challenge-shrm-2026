"use client";

import { useMemo, useRef, useState } from "react";
import {
  m,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import { cn } from "@/lib/utils";
import { GiftCard } from "./gift-card";
import type { InventoryGift } from "../engine/types";

interface GiftRevealProps {
  gift: InventoryGift;
  reduceMotion?: boolean;
  onRevealed?: () => void;
}

export function GiftReveal({
  gift,
  reduceMotion = false,
  onRevealed,
}: GiftRevealProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(reduceMotion);
  const [shimmering, setShimmering] = useState(false);
  const dragX = useMotionValue(0);

  const coverOpacity = useTransform(dragX, [0, 220], [1, 0.15]);
  const dustOpacity = useTransform(dragX, [0, 80, 220], [0, 0.55, 0]);

  const dustParticles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${8 + ((index * 17) % 84)}%`,
        top: `${18 + ((index * 23) % 64)}%`,
        size: 2 + (index % 3),
        delay: (index % 6) * 0.04,
      })),
    [],
  );

  const completeReveal = () => {
    if (revealed) return;
    setShimmering(true);
    setRevealed(true);
    onRevealed?.();
    window.setTimeout(() => setShimmering(false), 1200);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (reduceMotion) return;
    if (info.offset.x > 140 || info.velocity.x > 500) {
      void animate(dragX, 280, {
        duration: durations.slow,
        ease: easings.outExpo,
      }).then(() => completeReveal());
      return;
    }
    void animate(dragX, 0, {
      type: "spring",
      stiffness: 320,
      damping: 30,
    });
  };

  return (
    <div className="relative mx-auto w-full max-w-xl" ref={constraintsRef}>
      <div className="relative overflow-hidden rounded-[1.75rem]">
        <GiftCard gift={gift} reduceMotion={reduceMotion} />

        {!revealed ? (
          <m.div
            className={cn(
              "absolute inset-0 z-10 touch-none select-none",
              "glass-panel cursor-grab active:cursor-grabbing",
            )}
            style={{
              x: dragX,
              opacity: coverOpacity,
              willChange: "transform, opacity",
            }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 280 }}
            dragElastic={0.08}
            onDragEnd={onDragEnd}
            role="button"
            tabIndex={0}
            aria-label="Swipe to reveal your gift"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                completeReveal();
              }
            }}
            onClick={() => {
              if (reduceMotion) completeReveal();
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-navy-850/90 via-navy-900/85 to-navy-950/95" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.08)_45%,transparent_70%)]" />

            <m.div
              className="pointer-events-none absolute inset-0"
              style={{ opacity: dustOpacity }}
              aria-hidden
            >
              {dustParticles.map((particle) => (
                <span
                  key={particle.id}
                  className="absolute rounded-full bg-blue-200/70"
                  style={{
                    left: particle.left,
                    top: particle.top,
                    width: particle.size,
                    height: particle.size,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </m.div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <Text variant="micro" className="tracking-[0.2em] text-blue-200">
                Swipe to reveal
              </Text>
              <Text variant="caption" className="max-w-xs text-muted-foreground">
                A quiet gesture — your gift is waiting underneath.
              </Text>
              <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-white/10">
                <m.div
                  className="h-full w-1/2 rounded-full bg-gradient-blue"
                  animate={
                    reduceMotion
                      ? { x: 0 }
                      : { x: ["-20%", "120%", "-20%"] }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                  }
                />
              </div>
            </div>
          </m.div>
        ) : null}

        {shimmering ? (
          <m.div
            className="pointer-events-none absolute inset-0 z-20 bg-shimmer animate-magnus-shimmer"
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: easings.outExpo }}
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}
