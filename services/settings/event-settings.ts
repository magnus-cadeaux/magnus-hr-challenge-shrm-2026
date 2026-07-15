import { z } from "zod";
import { EVENT_NAME, APP_NAME } from "@/lib/constants";
import { UPGRADE_CONFIG } from "@/features/reward/config/inventory";
import { getOfflineDatabase } from "@/services/storage/dexie";
import { enqueueSyncItem } from "@/services/sync/queue";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { isBrowser } from "@/utils/device";

export const eventSettingsSchema = z.object({
  eventName: z.string().min(1),
  brandName: z.string().min(1),
  questionBankVersion: z.string().min(1),
  luckyUpgradeProbability: z.number().min(0).max(1),
  theme: z.string().min(1),
  rewardInventoryConfig: z.array(z.record(z.string(), z.unknown())).default([]),
});

export type EventSettings = z.infer<typeof eventSettingsSchema>;

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  eventName: EVENT_NAME,
  brandName: APP_NAME,
  questionBankVersion: "v1",
  luckyUpgradeProbability: UPGRADE_CONFIG.probability,
  theme: "dark_navy",
  rewardInventoryConfig: [],
};

const LOCAL_SETTINGS_KEY = "magnus.event.settings";

export function readLocalEventSettings(): EventSettings {
  if (!isBrowser()) return DEFAULT_EVENT_SETTINGS;
  const raw = window.localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (!raw) return DEFAULT_EVENT_SETTINGS;
  try {
    return eventSettingsSchema.parse(JSON.parse(raw));
  } catch {
    return DEFAULT_EVENT_SETTINGS;
  }
}

export async function persistEventSettings(
  settings: EventSettings,
): Promise<EventSettings> {
  const parsed = eventSettingsSchema.parse(settings);
  if (isBrowser()) {
    window.localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(parsed));
    await getOfflineDatabase().drafts.put({
      id: "event_settings:current",
      key: "event_settings",
      data: parsed,
      updatedAt: new Date().toISOString(),
    });
  }

  const remotePayload = {
    event_key: "current",
    event_name: parsed.eventName,
    brand_name: parsed.brandName,
    question_bank_version: parsed.questionBankVersion,
    lucky_upgrade_probability: parsed.luckyUpgradeProbability,
    theme: parsed.theme,
    reward_inventory_config: parsed.rewardInventoryConfig,
  };

  await enqueueSyncItem({
    entity: "event_settings",
    operation: "upsert",
    payload: remotePayload,
  });

  const client = getSupabaseBrowserClient();
  if (client) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client.from("event_settings") as any).upsert(remotePayload, {
      onConflict: "event_key",
    });
  }

  return parsed;
}

export async function loadEventSettings(): Promise<EventSettings> {
  const local = readLocalEventSettings();
  const client = getSupabaseBrowserClient();
  if (!client) return local;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (client.from("event_settings") as any)
    .select("*")
    .eq("event_key", "current")
    .maybeSingle();

  if (!data) return local;

  return eventSettingsSchema.parse({
    eventName: data.event_name,
    brandName: data.brand_name,
    questionBankVersion: data.question_bank_version,
    luckyUpgradeProbability: Number(data.lucky_upgrade_probability),
    theme: data.theme,
    rewardInventoryConfig: Array.isArray(data.reward_inventory_config)
      ? data.reward_inventory_config
      : [],
  });
}
