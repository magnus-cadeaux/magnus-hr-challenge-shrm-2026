"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Flex } from "@/components/layout";
import { Text } from "@/components/typography";
import { Surface } from "@/components/layout/surface";
import { cn } from "@/lib/utils";
import { formatIndianMobileDisplay } from "../../schema";

interface MobileStepProps {
  value: string;
  error?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MobileStep({
  value,
  error,
  onChange,
  onSubmit,
}: MobileStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <Flex gap="sm" align="stretch" className="w-full">
        <Surface
          variant="glass-subtle"
          padding="none"
          radius="md"
          className="flex h-14 min-w-[5.5rem] items-center justify-center px-3"
        >
          <Text as="span" variant="body" className="font-semibold tabular-nums">
            +91
          </Text>
        </Surface>
        <Input
          ref={inputRef}
          id="registration-mobile"
          value={formatIndianMobileDisplay(value)}
          placeholder="98765 43210"
          inputMode="tel"
          autoComplete="tel-national"
          aria-invalid={Boolean(error)}
          aria-describedby="registration-mobile-hint"
          className={cn(
            "h-14 flex-1 text-base tabular-nums shadow-glow-sm transition-[box-shadow,border-color] focus-visible:shadow-glow",
            error && "border-destructive/50",
          )}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
        />
      </Flex>
      {error ? (
        <Text variant="caption" className="mt-2 text-destructive" role="alert">
          {error}
        </Text>
      ) : (
        <Text
          id="registration-mobile-hint"
          variant="caption"
          className="mt-2"
        >
          India (+91) · 10-digit mobile number
        </Text>
      )}
    </div>
  );
}
