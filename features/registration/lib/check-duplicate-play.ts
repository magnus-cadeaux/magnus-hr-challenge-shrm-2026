import { getOfflineDatabase } from "@/services/storage/dexie";
import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { getActiveEventDay } from "@/features/leaderboard/engine/event-day";
import { normalizeIndianMobile } from "../schema";
import { hasLocalCompletedPlayToday } from "./play-log";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function phoneLookupVariants(phone: string): string[] {
  const local = normalizeIndianMobile(phone);
  if (!local) return [];
  return Array.from(
    new Set([local, `91${local}`, `+91${local}`, `0${local}`]),
  );
}

function isCompletedOnEventDay(
  completedAt: string | null | undefined,
  eventDay: string,
): boolean {
  if (!completedAt) return false;
  // ISO timestamps and date-only strings both start with YYYY-MM-DD.
  return completedAt.slice(0, 10) === eventDay;
}

async function hasDexieCompletedPlayToday(
  phone: string,
  email: string,
): Promise<boolean> {
  const eventDay = getActiveEventDay();
  const normalizedPhone = normalizeIndianMobile(phone);
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedPhone && !normalizedEmail) return false;

  try {
    const rows = await getOfflineDatabase().sessions.toArray();
    const matchingSessionIds = new Set<string>();

    for (const row of rows) {
      const entity =
        typeof row.payload.entity === "string"
          ? row.payload.entity
          : row.id.split(":")[0];
      if (entity !== "participants") continue;

      const rowPhone = normalizeIndianMobile(String(row.payload.phone ?? ""));
      const rowEmail = normalizeEmail(String(row.payload.email ?? ""));
      const phoneMatch =
        Boolean(normalizedPhone) && rowPhone === normalizedPhone;
      const emailMatch =
        Boolean(normalizedEmail) && rowEmail === normalizedEmail;
      if (!phoneMatch && !emailMatch) continue;

      if (typeof row.payload.local_session_id === "string") {
        matchingSessionIds.add(row.payload.local_session_id);
      }
    }

    if (matchingSessionIds.size === 0) return false;

    for (const row of rows) {
      const entity =
        typeof row.payload.entity === "string"
          ? row.payload.entity
          : row.id.split(":")[0];
      if (entity !== "challenge_sessions") continue;
      if (row.payload.status !== "completed") continue;
      if (
        !isCompletedOnEventDay(
          typeof row.payload.completed_at === "string"
            ? row.payload.completed_at
            : null,
          eventDay,
        )
      ) {
        continue;
      }
      const localSessionId =
        typeof row.payload.local_session_id === "string"
          ? row.payload.local_session_id
          : row.id.replace(/^challenge_sessions:/, "");
      if (matchingSessionIds.has(localSessionId)) return true;
    }
  } catch {
    /* offline db unavailable */
  }

  return false;
}

async function hasRemoteCompletedPlayToday(
  phone: string,
  email: string,
): Promise<boolean> {
  const client = getSupabaseBrowserClient();
  if (!client) return false;

  const eventDay = getActiveEventDay();
  const dayStart = `${eventDay}T00:00:00.000`;
  const dayEnd = `${eventDay}T23:59:59.999`;
  const normalizedPhone = normalizeIndianMobile(phone);
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedPhone && !normalizedEmail) return false;

  const quote = (value: string) => `"${value.replace(/"/g, "")}"`;
  const orParts: string[] = [];
  for (const variant of phoneLookupVariants(normalizedPhone)) {
    orParts.push(`phone.eq.${quote(variant)}`);
  }
  if (normalizedEmail) {
    orParts.push(`email.eq.${quote(normalizedEmail)}`);
  }
  if (orParts.length === 0) return false;

  try {
    const { data: participants, error } = await client
      .from("participants")
      .select("id, phone, email, completed_at")
      .or(orParts.join(","))
      .limit(25);

    if (error || !participants?.length) return false;

    const matched = participants.filter((row) => {
      const rowPhone = normalizeIndianMobile(String(row.phone ?? ""));
      const rowEmail = normalizeEmail(String(row.email ?? ""));
      const phoneMatch =
        Boolean(normalizedPhone) && rowPhone === normalizedPhone;
      const emailMatch =
        Boolean(normalizedEmail) && rowEmail === normalizedEmail;
      return phoneMatch || emailMatch;
    });

    if (matched.length === 0) return false;

    if (
      matched.some((row) =>
        isCompletedOnEventDay(row.completed_at, eventDay),
      )
    ) {
      return true;
    }

    const ids = matched.map((row) => row.id).filter(Boolean);
    if (ids.length === 0) return false;

    const { data: sessions, error: sessionError } = await client
      .from("challenge_sessions")
      .select("id, status, completed_at, participant_id")
      .eq("status", "completed")
      .in("participant_id", ids)
      .gte("completed_at", dayStart)
      .lte("completed_at", dayEnd)
      .limit(1);

    if (sessionError) return false;
    return Boolean(sessions?.length);
  } catch {
    return false;
  }
}

/**
 * Soft duplicate-play check for today's event day.
 * Never throws — failures degrade to "no duplicate" so registration continues.
 */
export async function hasCompletedPlayToday(
  phone: string,
  email: string,
): Promise<boolean> {
  if (hasLocalCompletedPlayToday(phone, email)) return true;
  if (await hasDexieCompletedPlayToday(phone, email)) return true;
  return hasRemoteCompletedPlayToday(phone, email);
}
