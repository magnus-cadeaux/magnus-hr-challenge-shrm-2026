"use client";

import { cn } from "@/lib/utils";
import type { ArenaTab } from "../engine/types";

const TABS: Array<{ id: ArenaTab; label: string }> = [
  { id: "individuals", label: "Individuals" },
  { id: "companies", label: "Companies" },
  { id: "signatures", label: "HR Signatures" },
];

interface ArenaTabsProps {
  value: ArenaTab;
  onChange: (tab: ArenaTab) => void;
}

export function ArenaTabs({ value, onChange }: ArenaTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Arena views"
      className="inline-flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md"
    >
      {TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-xl px-5 py-3 text-sm font-semibold tracking-wide transition-colors md:text-base",
              active
                ? "bg-gradient-blue text-white shadow-lg shadow-blue-500/20"
                : "text-blue-100/70 hover:bg-white/5 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
