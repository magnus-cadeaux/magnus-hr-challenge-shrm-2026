import type { MotionProps } from "framer-motion";
import { springs } from "@/lib/design-system/motion";

export const buttonPressMotion: MotionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: springs.snappy,
};

export const buttonPress = buttonPressMotion;
