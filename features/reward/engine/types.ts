export type GiftTier = "A" | "B" | "C" | "premium_upgrade";

export type InventoryGift = {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  tier: GiftTier;
  stock: number;
  reserved: number;
};

export type RewardAssignment = {
  sessionId: string;
  gift: InventoryGift;
  collectionCode: string;
  upgraded: boolean;
  baseGiftId: string;
  assignedAt: string;
};

export type UpgradeConfig = {
  enabled: boolean;
  /** Probability 0–1, e.g. 0.03 = 3% */
  probability: number;
  premiumGiftId: string;
};

export type RewardEngineResult = {
  assignment: RewardAssignment;
  inventorySnapshot: InventoryGift[];
};
