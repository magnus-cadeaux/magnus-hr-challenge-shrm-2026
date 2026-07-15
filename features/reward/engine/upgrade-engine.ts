import { UPGRADE_CONFIG } from "../config/inventory";
import type { InventoryProvider } from "./inventory-provider";
import type { InventoryGift, UpgradeConfig } from "./types";

export type UpgradeDecision = {
  upgraded: boolean;
  gift: InventoryGift | null;
};

/**
 * Configuration-driven lucky upgrade.
 * Inventory-aware: never upgrades if premium stock is exhausted.
 */
export function evaluateLuckyUpgrade(
  provider: InventoryProvider,
  config: UpgradeConfig = UPGRADE_CONFIG,
  random: () => number = Math.random,
): UpgradeDecision {
  if (!config.enabled) {
    return { upgraded: false, gift: null };
  }

  const premium = provider.getById(config.premiumGiftId);
  if (!premium || premium.stock - premium.reserved <= 0) {
    return { upgraded: false, gift: null };
  }

  if (random() > config.probability) {
    return { upgraded: false, gift: null };
  }

  const reserved = provider.reserve(config.premiumGiftId);
  return {
    upgraded: Boolean(reserved),
    gift: reserved,
  };
}
