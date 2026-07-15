import confetti, { type Options as ConfettiOptions } from "canvas-confetti";

const defaultOptions: ConfettiOptions = {
  particleCount: 80,
  spread: 70,
  origin: { y: 0.7 },
  colors: ["#3b82f6", "#60a5fa", "#22d3ee", "#93c5fd"],
};

const achievementOptions: ConfettiOptions = {
  particleCount: 120,
  spread: 90,
  origin: { y: 0.65 },
  colors: ["#d4af37", "#e8c547", "#f0d875", "#3b82f6"],
};

export function fireConfetti(options?: ConfettiOptions) {
  return confetti({
    ...defaultOptions,
    ...options,
  });
}

export function fireAchievementConfetti(options?: ConfettiOptions) {
  return confetti({
    ...achievementOptions,
    ...options,
  });
}

export function resetConfetti() {
  confetti.reset();
}
