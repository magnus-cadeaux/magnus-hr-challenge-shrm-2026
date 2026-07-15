"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";

interface EmailStepProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function EmailStep({ value, onChange, onSubmit }: EmailStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <Input
        ref={inputRef}
        id="registration-email"
        type="email"
        value={value}
        placeholder="name@company.com"
        autoComplete="email"
        inputMode="email"
        className={cn(
          "h-14 text-base shadow-glow-sm transition-[box-shadow,border-color] focus-visible:shadow-glow",
        )}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <Text variant="caption" className="mt-2">
        Prefer your work email — we won&apos;t block you if it looks unfinished.
      </Text>
    </div>
  );
}
