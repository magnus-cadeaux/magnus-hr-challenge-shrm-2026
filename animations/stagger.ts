import type { Variants } from "framer-motion";
import { durations } from "@/lib/design-system/motion";

export function createStaggerContainer(
  staggerChildren = 0.08,
  delayChildren = 0.04,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export const staggerContainer = createStaggerContainer();

export const staggerFast = createStaggerContainer(0.05, 0.02);
export const staggerSlow = createStaggerContainer(0.14, 0.1);

export const staggerItemFadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
