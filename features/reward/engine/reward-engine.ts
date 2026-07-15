import type { GiftTier, InventoryGift, RewardAssignment, RewardEngineResult } from "./types";
import { getInventoryProvider, type InventoryProvider } from "./inventory-provider";
import { generateCollectionCode } from "./collection-code";
import { UPGRADE_CONFIG } from "../config/inventory";

const TIER_PRIORITY: GiftTier[] = ["A", "B", "C"];

function pickBaseCandidate(
  provider: InventoryProvider,
  sessionId: string,
): InventoryGift | null {
  for (const tier of TIER_PRIORITY) {
    const available = provider.available(tier);
    if (available.length === 0) continue;

    let hash = 0;
    for (let i = 0; i < sessionId.length; i += 1) {
      hash = (hash + sessionId.charCodeAt(i) * (i + 3)) % available.length;
    }
    return available[hash] ?? available[0];
  }
  return null;
}

function shouldUpgrade(
  provider: InventoryProvider,
  random: () => number,
): InventoryGift | null {
  if (!UPGRADE_CONFIG.enabled) return null;
  const premium = provider.getById(UPGRADE_CONFIG.premiumGiftId);
  if (!premium || premium.stock - premium.reserved <= 0) return null;
  if (random() > UPGRADE_CONFIG.probability) return null;
  return premium;
}

export function assignReward(
  sessionId: string,
  options?: {
    provider?: InventoryProvider;
    random?: () => number;
  },
): RewardEngineResult | null {
  const provider = options?.provider ?? getInventoryProvider();
  const random = options?.random ?? Math.random;

  const baseCandidate = pickBaseCandidate(provider, sessionId);
  if (!baseCandidate) return null;

  const upgradeCandidate = shouldUpgrade(provider, random);
  const chosenId = upgradeCandidate?.id ?? baseCandidate.id;
  const reserved = provider.reserve(chosenId);
  if (!reserved) return null;

  const assignment: RewardAssignment = {
    sessionId,
    gift: reserved,
    collectionCode: generateCollectionCode(sessionId),
    upgraded: Boolean(upgradeCandidate),
    baseGiftId: baseCandidate.id,
    assignedAt: new Date().toISOString(),
  };

  return {
    assignment,
    inventorySnapshot: provider.list(),
  };
}
