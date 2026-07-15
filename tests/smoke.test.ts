import { describe, expect, it } from "vitest";
import { nextBackoffMs, shouldPreferLocal } from "@/services/sync/queue";
import { toCsv, filenameForExport } from "@/lib/exports/csv";
import { eventSettingsSchema, DEFAULT_EVENT_SETTINGS } from "@/services/settings";
import { isSupabaseConfigured } from "@/lib/env";
import { PARTICIPANT_SESSION_KEYS, KIOSK_IDLE_MS } from "@/lib/kiosk";

describe("production smoke", () => {
  it("computes sync backoff", () => {
    expect(nextBackoffMs(1)).toBe(2000);
    expect(nextBackoffMs(10)).toBe(5 * 60 * 1000);
  });

  it("resolves LWW conflicts", () => {
    expect(shouldPreferLocal("2026-07-15T10:00:00.000Z", "2026-07-15T09:00:00.000Z")).toBe(
      true,
    );
    expect(shouldPreferLocal("2026-07-15T09:00:00.000Z", "2026-07-15T10:00:00.000Z")).toBe(
      false,
    );
  });

  it("serializes csv", () => {
    const csv = toCsv([
      { name: "Aanya", score: 88 },
      { name: "Rohan", score: 84 },
    ]);
    expect(csv.split("\n")[0]).toContain("name");
    expect(csv).toContain("Aanya");
  });

  it("names export files", () => {
    expect(filenameForExport("participants")).toMatch(/^magnus-participants-/);
  });

  it("validates default event settings", () => {
    expect(eventSettingsSchema.parse(DEFAULT_EVENT_SETTINGS).brandName).toBeTruthy();
  });

  it("exposes kiosk idle window", () => {
    expect(KIOSK_IDLE_MS).toBe(90_000);
    expect(PARTICIPANT_SESSION_KEYS.length).toBeGreaterThan(3);
  });

  it("reports supabase configuration safely", () => {
    expect(typeof isSupabaseConfigured()).toBe("boolean");
  });
});
