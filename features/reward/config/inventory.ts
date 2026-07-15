import type { InventoryGift, UpgradeConfig } from "../engine/types";

/**
 * Local mock inventory.
 * Architecture supports future Supabase provider with the same shape.
 */
export const MOCK_INVENTORY: InventoryGift[] = [
  {
    id: "gift-eco-tote",
    name: "Eco Felt Business Tote",
    description: "Crafted using recycled materials.",
    imageSrc: "/images/placeholders/gift-eco-tote.svg",
    tier: "A",
    stock: 40,
    reserved: 0,
  },
  {
    id: "gift-notebook",
    name: "Magnus Executive Notebook",
    description: "A quiet essential for leaders who capture ideas with intent.",
    imageSrc: "/images/placeholders/gift-notebook.svg",
    tier: "A",
    stock: 35,
    reserved: 0,
  },
  {
    id: "gift-bottle",
    name: "Brushed Steel Desk Bottle",
    description: "Premium daily utility with understated presence.",
    imageSrc: "/images/placeholders/gift-bottle.svg",
    tier: "B",
    stock: 28,
    reserved: 0,
  },
  {
    id: "gift-desk-set",
    name: "Minimal Desk Accent Set",
    description: "Small details that refine a workspace without noise.",
    imageSrc: "/images/placeholders/gift-desk-set.svg",
    tier: "B",
    stock: 22,
    reserved: 0,
  },
  {
    id: "gift-badge",
    name: "Enamel Leadership Pin",
    description: "A discreet mark of participation and craft.",
    imageSrc: "/images/placeholders/gift-badge.svg",
    tier: "C",
    stock: 50,
    reserved: 0,
  },
  {
    id: "gift-premium-case",
    name: "Premium Leather Card Sleeve",
    description: "An elevated keepsake reserved for rare unlocks.",
    imageSrc: "/images/placeholders/gift-premium-case.svg",
    tier: "premium_upgrade",
    stock: 8,
    reserved: 0,
  },
];

export const UPGRADE_CONFIG: UpgradeConfig = {
  enabled: true,
  probability: 0.03,
  premiumGiftId: "gift-premium-case",
};

export const COLLECTION_CODE_PREFIX = "MHC" as const;
