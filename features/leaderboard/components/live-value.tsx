"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatScore } from "@/utils/format";

interface LiveValueProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Booth-readable counter that re-animates on every live update. */
export function LiveValue({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: LiveValueProps) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    stiffness: 90,
    damping: 22,
    mass: 0.6,
  });
  const [display, setDisplay] = useState(() => formatScore(value, decimals));

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(formatScore(latest, decimals));
    });
    return unsubscribe;
  }, [spring, decimals]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
