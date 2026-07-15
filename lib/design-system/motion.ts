import type { Transition } from "framer-motion";
import { motionTokens } from "./tokens";

export const easings = motionTokens.ease;

export const durations = motionTokens.duration;

export const springs = motionTokens.spring;

export function transition(
  duration: keyof typeof durations = "slow",
  ease: keyof typeof easings = "outExpo",
): Transition {
  return {
    duration: durations[duration],
    ease: easings[ease],
  };
}

export const transitions = {
  instant: transition("instant"),
  fast: transition("fast"),
  base: transition("base"),
  slow: transition("slow"),
  reveal: transition("reveal"),
  dramatic: transition("dramatic"),
  exit: { duration: durations.fast, ease: "easeIn" as const },
} as const;
