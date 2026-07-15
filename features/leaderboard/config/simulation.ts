import type { SimulationConfig } from "../engine/types";

export const SIMULATION_CONFIG: SimulationConfig = {
  tickMinMs: 8000,
  tickMaxMs: 15000,
  quoteIntervalMs: 10000,
  momentDurationMs: 4000,
  momentProbability: 0.12,
  momentCooldownMs: 45000,
  joinProbability: 0.28,
  topN: 10,
};
