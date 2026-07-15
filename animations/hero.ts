import type { Variants } from "framer-motion";
import { easeOutExpo } from "./fade";
import { durations } from "@/lib/design-system/motion";

export const heroRevealVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: durations.reveal + 0.1,
      ease: easeOutExpo,
    },
  },
};

export const heroStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const heroReveal = {
  item: heroRevealVariants,
  container: heroStaggerContainer,
};
