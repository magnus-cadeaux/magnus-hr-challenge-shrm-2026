import type { Variants } from "framer-motion";
import { durations, easings } from "@/lib/design-system/motion";

export const blurInVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: durations.reveal,
      ease: easings.outExpo,
    },
  },
};

export const blur = blurInVariants;
