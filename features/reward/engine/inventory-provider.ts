import type { GiftTier, InventoryGift } from "./types";
import { MOCK_INVENTORY } from "../config/inventory";

export interface InventoryProvider {
  list(): InventoryGift[];
  getById(id: string): InventoryGift | null;
  available(tier?: GiftTier): InventoryGift[];
  /** Local reservation for exhibition mock; future Supabase writes go here. */
  reserve(id: string): InventoryGift | null;
}

function cloneInventory(items: InventoryGift[]): InventoryGift[] {
  return items.map((item) => ({ ...item }));
}

export function createLocalInventoryProvider(
  seed: InventoryGift[] = MOCK_INVENTORY,
): InventoryProvider {
  let items = cloneInventory(seed);

  return {
    list() {
      return cloneInventory(items);
    },
    getById(id: string) {
      const found = items.find((item) => item.id === id);
      return found ? { ...found } : null;
    },
    available(tier?: GiftTier) {
      return items
        .filter((item) => (tier ? item.tier === tier : true))
        .filter((item) => item.stock - item.reserved > 0)
        .map((item) => ({ ...item }));
    },
    reserve(id: string) {
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) return null;
      const current = items[index];
      if (current.stock - current.reserved <= 0) return null;
      items = items.map((item, i) =>
        i === index ? { ...item, reserved: item.reserved + 1 } : item,
      );
      return { ...items[index] };
    },
  };
}

/** Session-scoped singleton for the exhibition kiosk runtime. */
let sharedProvider: InventoryProvider | null = null;

export function getInventoryProvider(): InventoryProvider {
  if (!sharedProvider) {
    sharedProvider = createLocalInventoryProvider();
  }
  return sharedProvider;
}

export function resetInventoryProvider(seed?: InventoryGift[]): void {
  sharedProvider = createLocalInventoryProvider(seed);
}
