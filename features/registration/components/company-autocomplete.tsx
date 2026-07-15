"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Surface } from "@/components/layout/surface";
import { Text } from "@/components/typography";
import { cn } from "@/lib/utils";
import { ORGANIZATION_SUGGESTIONS } from "../constants";

interface CompanyAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string | null;
  autoFocus?: boolean;
}

export function CompanyAutocomplete({
  value,
  onChange,
  onSubmit,
  error,
  autoFocus = true,
}: CompanyAutocompleteProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [...ORGANIZATION_SUGGESTIONS];
    return ORGANIZATION_SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(query),
    );
  }, [value]);

  useEffect(() => {
    if (!autoFocus) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        id="registration-company"
        value={value}
        placeholder="Start typing your organization"
        autoComplete="organization"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={Boolean(error)}
        className={cn(
          "h-14 text-base shadow-glow-sm transition-[box-shadow,border-color] focus-visible:shadow-glow",
          error && "border-destructive/50",
        )}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) =>
              Math.min(index + 1, Math.max(suggestions.length - 1, 0)),
            );
            return;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
            return;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            if (open && suggestions[activeIndex]) {
              selectSuggestion(suggestions[activeIndex]);
              return;
            }
            onSubmit();
            return;
          }
          if (event.key === "Escape") {
            if (open) {
              event.preventDefault();
              setOpen(false);
            }
          }
        }}
      />

      {open && suggestions.length > 0 ? (
        <Surface
          variant="glass-panel"
          padding="none"
          radius="lg"
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-[var(--z-dropdown)] max-h-56 overflow-auto py-2 shadow-lift"
          role="listbox"
          id={listId}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "flex w-full px-4 py-2.5 text-left text-sm transition-colors",
                index === activeIndex
                  ? "bg-primary/20 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {suggestion}
            </button>
          ))}
        </Surface>
      ) : null}

      {error ? (
        <Text variant="caption" className="mt-2 text-destructive" role="alert">
          {error}
        </Text>
      ) : (
        <Text variant="caption" className="mt-2">
          Autocomplete ready — pick a suggestion or type freely.
        </Text>
      )}
    </div>
  );
}
