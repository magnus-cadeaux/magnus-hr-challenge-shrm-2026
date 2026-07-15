"use client";

import { Chip } from "@/components/ui/chip";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";

interface InsightChipRowProps {
  title: string;
  items: Array<{ id: string; label: string }>;
  emptyLabel?: string;
  className?: string;
}

export function InsightChipRow({
  title,
  items,
  emptyLabel = "No signals inferred yet.",
  className,
}: InsightChipRowProps) {
  return (
    <Stack gap="md" className={className}>
      <Text variant="heading" className="text-xl md:text-2xl">
        {title}
      </Text>
      {items.length === 0 ? (
        <Text variant="caption">{emptyLabel}</Text>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {items.map((item, index) => (
            <Chip
              key={item.id}
              variant={index === 0 ? "active" : "default"}
              className={cn(
                "pointer-events-none min-h-11 cursor-default px-4 py-2.5 text-sm md:text-base",
              )}
              tabIndex={-1}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      )}
    </Stack>
  );
}
