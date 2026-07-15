"use client";

import { useCallback } from "react";
import type { Options as ConfettiOptions } from "canvas-confetti";
import {
  fireAchievementConfetti,
  fireConfetti,
  resetConfetti,
} from "@/services/confetti";

export function useConfetti() {
  const celebrate = useCallback((options?: ConfettiOptions) => {
    void fireConfetti(options);
  }, []);

  const celebrateAchievement = useCallback((options?: ConfettiOptions) => {
    void fireAchievementConfetti(options);
  }, []);

  const reset = useCallback(() => {
    resetConfetti();
  }, []);

  return { celebrate, celebrateAchievement, reset } as const;
}
