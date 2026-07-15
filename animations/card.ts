import type { MotionProps, Variants } from "framer-motion";
import { defaultTransition } from "./fade";

export const cardLiftVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
  },
  hover: {
    y: -6,
    boxShadow:
      "0 18px 48px rgba(0, 0, 0, 0.48), 0 0 40px rgba(59, 130, 246, 0.12)",
    transition: defaultTransition,
  },
};

export const cardLiftMotion: MotionProps = {
  initial: "rest",
  whileHover: "hover",
  variants: cardLiftVariants,
};

export const cardLift = {
  variants: cardLiftVariants,
  motion: cardLiftMotion,
};
