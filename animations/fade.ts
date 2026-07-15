import type { Transition, Variants } from "framer-motion";
import { easings, transitions, durations } from "@/lib/design-system/motion";

export const easeOutExpo = easings.outExpo;

export const defaultTransition: Transition = transitions.slow;

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: transitions.exit,
  },
};

export const fade = fadeVariants;

export function createFadeVariants(duration: number = durations.slow): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration, ease: easeOutExpo },
    },
    exit: {
      opacity: 0,
      transition: transitions.exit,
    },
  };
}
