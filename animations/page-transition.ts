import type { Variants } from "framer-motion";
import { easeOutExpo } from "./fade";
import { durations } from "@/lib/design-system/motion";

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow + 0.05,
      ease: easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: durations.base,
      ease: "easeIn",
    },
  },
};

export const pageTransition = pageTransitionVariants;
