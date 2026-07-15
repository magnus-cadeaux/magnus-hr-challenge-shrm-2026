import type { MotionProps } from "framer-motion";
import { durations, easings } from "@/lib/design-system/motion";

export const glassHoverMotion: MotionProps = {
  whileHover: {
    y: -2,
    boxShadow:
      "0 16px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.18)",
    transition: { duration: durations.base, ease: easings.outExpo },
  },
  whileTap: {
    y: 0,
    scale: 0.995,
  },
};

export const glassHover = glassHoverMotion;
