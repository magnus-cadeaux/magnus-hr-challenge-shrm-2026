import type { InventoryTierSnapshot } from "./types";

/**
 * Aggregated gift inventory by tier (mock operational view).
 * Available + Reserved + Distributed ≈ opening stock for the day.
 */
export const MOCK_INVENTORY_TIERS: InventoryTierSnapshot[] = [
  {
    id: "A",
    label: "Tier A",
    available: 52,
    reserved: 8,
    distributed: 55,
    lowStockThreshold: 20,
  },
  {
    id: "B",
    label: "Tier B",
    available: 31,
    reserved: 6,
    distributed: 41,
    lowStockThreshold: 15,
  },
  {
    id: "C",
    label: "Tier C",
    available: 38,
    reserved: 4,
    distributed: 28,
    lowStockThreshold: 12,
  },
  {
    id: "premium_upgrade",
    label: "Premium Upgrade",
    available: 3,
    reserved: 1,
    distributed: 4,
    lowStockThreshold: 4,
  },
];
