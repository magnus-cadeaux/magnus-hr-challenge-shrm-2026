"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";

interface NameStepProps {
  value: string;
  error?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function NameStep({ value, error, onChange, onSubmit }: NameStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <Input
        ref={inputRef}
        id="registration-name"
        value={value}
        placeholder="Enter your name"
        autoComplete="name"
        autoCapitalize="words"
        aria-invalid={Boolean(error)}
        className={cn(
          "h-14 text-base shadow-glow-sm transition-[box-shadow,border-color] focus-visible:shadow-glow",
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
      {error ? (
        <Text variant="caption" className="mt-2 text-destructive" role="alert">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
