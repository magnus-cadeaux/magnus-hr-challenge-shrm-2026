"use client";

import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { InventoryTierCard } from "./inventory-tier-card";
import type { InventoryTierSnapshot } from "../config/types";

interface InventoryRowProps {
  inventory: InventoryTierSnapshot[];
}

export function InventoryRow({ inventory }: InventoryRowProps) {
  return (
    <Stack gap="md">
      <Text variant="heading" className="text-xl md:text-2xl">
        Gift Inventory
      </Text>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {inventory.map((tier) => (
          <InventoryTierCard key={tier.id} tier={tier} />
        ))}
      </div>
    </Stack>
  );
}
