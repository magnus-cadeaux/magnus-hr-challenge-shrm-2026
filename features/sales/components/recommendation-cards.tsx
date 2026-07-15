"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import type { ScoredItem, MagnusProductId } from "../engine/types";

interface RecommendationCardsProps {
  products: ScoredItem<MagnusProductId>[];
}

export function RecommendationCards({ products }: RecommendationCardsProps) {
  const items = products.slice(0, 3);

  return (
    <Stack gap="md">
      <Text variant="heading" className="text-xl md:text-2xl">
        Recommended Magnus Solutions
      </Text>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((product, index) => (
          <GlassCard
            key={product.id}
            intensity={index === 0 ? "strong" : "default"}
            padding="lg"
            gradientBorder={index === 0}
            className="flex h-full flex-col gap-4"
          >
            <Text variant="eyebrow" className="text-blue-200/70">
              Solution {index + 1}
            </Text>
            <Text variant="heading" className="text-xl">
              {product.label}
            </Text>
            <Text variant="body-sm" className="text-base leading-relaxed">
              {product.reasons[0] ?? "Aligned to this profile’s signals."}
            </Text>
            <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
              <Text variant="micro" className="mb-2 text-muted-foreground">
                Suggested opening
              </Text>
              <Text variant="body" className="text-base leading-relaxed text-blue-50">
                {product.opening ??
                  `Would ${product.label} be useful in your current programmes?`}
              </Text>
            </div>
          </GlassCard>
        ))}
      </div>
    </Stack>
  );
}
