import { STORAGE_KEYS } from "@/lib/constants";
import { isBrowser } from "@/utils/device";
import { getActiveEventDay } from "@/features/leaderboard/engine/event-day";
import { normalizeIndianMobile } from "../schema";

export interface PlayLogEntry {
  phone: string;
  email: string;
  completedAt: string;
}

type PlayLogByDay = Record<string, PlayLogEntry[]>;

function readLog(): PlayLogByDay {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.playLog);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PlayLogByDay;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLog(log: PlayLogByDay): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.playLog, JSON.stringify(log));
  } catch {
    /* ignore quota */
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function entryMatches(
  entry: PlayLogEntry,
  phone: string,
  email: string,
): boolean {
  const normalizedPhone = normalizeIndianMobile(phone);
  const normalizedEmail = normalizeEmail(email);
  if (normalizedPhone && entry.phone && entry.phone === normalizedPhone) {
    return true;
  }
  if (normalizedEmail && entry.email && entry.email === normalizedEmail) {
    return true;
  }
  return false;
}

/** Record a completed play for today's event day (soft guard, local). */
export function recordCompletedPlay(input: {
  phone?: string | null;
  email?: string | null;
}): void {
  if (!isBrowser()) return;
  const phone = normalizeIndianMobile(input.phone ?? "");
  const email = normalizeEmail(input.email ?? "");
  if (!phone && !email) return;

  const eventDay = getActiveEventDay();
  const log = readLog();
  const dayEntries = log[eventDay] ?? [];
  const already = dayEntries.some((entry) => entryMatches(entry, phone, email));
  if (already) {
    writeLog(log);
    return;
  }

  log[eventDay] = [
    ...dayEntries,
    {
      phone,
      email,
      completedAt: new Date().toISOString(),
    },
  ];
  writeLog(log);
}

export function hasLocalCompletedPlayToday(
  phone: string,
  email: string,
): boolean {
  if (!isBrowser()) return false;
  const eventDay = getActiveEventDay();
  const dayEntries = readLog()[eventDay] ?? [];
  return dayEntries.some((entry) => entryMatches(entry, phone, email));
}
