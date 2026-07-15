import type { Variants } from "framer-motion";
import { durations, easings } from "@/lib/design-system/motion";

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, clipPath: "inset(8% 0 8% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0% 0)",
    transition: {
      duration: durations.reveal,
      ease: easings.outExpo,
    },
  },
};

export const reveal = revealVariants;
