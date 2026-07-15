import type { InventoryTierSnapshot } from "./types";
import { MOCK_INVENTORY_TIERS } from "./inventory";
import { isBrowser } from "@/utils/device";

const INVENTORY_SNAPSHOT_KEY = "magnus.admin.inventory.snapshot";

/**
 * Aggregated gift inventory by tier (mock operational view).
 * Available + Reserved + Distributed ≈ opening stock for the day.
 */
export function readInventoryTier(): InventoryTierSnapshot[] {
  if (!isBrowser()) return MOCK_INVENTORY_TIERS;
  try {
    const raw = window.localStorage.getItem(INVENTORY_SNAPSHOT_KEY);
    if (!raw) return MOCK_INVENTORY_TIERS;
    const parsed = JSON.parse(raw) as InventoryTierSnapshot[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : MOCK_INVENTORY_TIERS;
  } catch {
    return MOCK_INVENTORY_TIERS;
  }
}

/** Zero reserved + distributed; fold those counts back into available. */
export function resetLocalInventoryTier(): InventoryTierSnapshot[] {
  const current = readInventoryTier();
  const next = current.map((tier) => ({
    ...tier,
    available: tier.available + tier.reserved + tier.distributed,
    reserved: 0,
    distributed: 0,
  }));
  if (isBrowser()) {
    window.localStorage.setItem(INVENTORY_SNAPSHOT_KEY, JSON.stringify(next));
  }
  return next;
}
