import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { getActiveEventDay } from "@/features/leaderboard/engine/event-day";
import { normalizeIndianMobile } from "@/features/registration/schema";
import type { BadgeScanFields } from "@/features/badge-scan";

export interface QuickScanContact {
  fullName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
}

export function toQuickScanContact(fields: BadgeScanFields): QuickScanContact {
  return {
    fullName: fields.fullName.trim(),
    organization: fields.organization.trim(),
    title: fields.title.trim(),
    phone: normalizeIndianMobile(fields.phone),
    email: fields.email.trim(),
  };
}

export type SaveQuickContactResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Insert a staff quick-scan contact. Never creates challenge / signature / reward rows.
 */
export async function saveQuickScanContact(
  contact: QuickScanContact,
): Promise<SaveQuickContactResult> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { ok: false, error: "Supabase is not configured on this device." };
  }

  const fullName = contact.fullName.trim();
  if (!fullName) {
    return { ok: false, error: "Name is required before saving." };
  }

  const now = new Date().toISOString();
  const payload = {
    full_name: fullName,
    company_name: contact.organization || null,
    phone: contact.phone || null,
    email: contact.email || null,
    source: "quick_scan",
    started_at: now,
    completed_at: null,
    updated_at: now,
  };

  try {
    const { data, error } = await client
      .from("participants")
      .insert(payload as never)
      .select("id")
      .single();

    if (error) {
      return { ok: false, error: error.message || "Could not save contact." };
    }

    return { ok: true, id: String((data as { id?: string } | null)?.id ?? "") };
  } catch {
    return { ok: false, error: "Could not save contact." };
  }
}

/** Count today's quick_scan participant rows for the active event day. */
export async function countQuickScansToday(): Promise<number> {
  const client = getSupabaseBrowserClient();
  if (!client) return 0;

  const eventDay = getActiveEventDay();
  const dayStart = `${eventDay}T00:00:00.000`;
  const dayEnd = `${eventDay}T23:59:59.999`;

  try {
    const { count, error } = await client
      .from("participants")
      .select("id", { count: "exact", head: true })
      .eq("source", "quick_scan")
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
