import type { Variants } from "framer-motion";
import { defaultTransition, easeOutExpo } from "./fade";
import { durations } from "@/lib/design-system/motion";

export function createSlideVariants(
  axis: "x" | "y",
  distance = 24,
): Variants {
  const hidden =
    axis === "y" ? { opacity: 0, y: distance } : { opacity: 0, x: distance };

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: defaultTransition,
    },
    exit: {
      opacity: 0,
      ...(axis === "y" ? { y: -distance / 2 } : { x: -distance / 2 }),
      transition: { duration: durations.fast, ease: "easeIn" },
    },
  };
}

export const slideUpVariants = createSlideVariants("y", 24);
export const slideDownVariants = createSlideVariants("y", -24);
export const slideLeftVariants = createSlideVariants("x", 32);
export const slideRightVariants = createSlideVariants("x", -32);

export const slide = {
  up: slideUpVariants,
  down: slideDownVariants,
  left: slideLeftVariants,
  right: slideRightVariants,
};

export { easeOutExpo };
