import type { Variants } from "framer-motion";
import { defaultTransition } from "./fade";
import { durations } from "@/lib/design-system/motion";

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: durations.fast },
  },
};

export const scalePopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 24,
    },
  },
};

export const scale = scaleVariants;
