import type { Transition } from "framer-motion";
import { transitions, springs } from "@/lib/design-system/motion";

export const presenceTransition: Transition = transitions.slow;

export const overlayTransition: Transition = {
  ...transitions.base,
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.soft,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: transitions.exit,
  },
};

export const presence = {
  transition: presenceTransition,
  overlay: overlayTransition,
  modal: modalTransition,
};
