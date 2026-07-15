import { isBrowser } from "@/utils/device";

const EVENT_DAY_OVERRIDE_KEY = "magnus.leaderboard.event_day";

/** Local calendar date as `YYYY-MM-DD`. */
export function todayEventDay(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Event day used for leaderboard write/read filtering.
 * Defaults to today; admin "Start New Day" can bump this without redeploying.
 */
export function getActiveEventDay(): string {
  if (!isBrowser()) return todayEventDay();
  try {
    const override = window.localStorage.getItem(EVENT_DAY_OVERRIDE_KEY);
    if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) return override;
  } catch {
    /* ignore */
  }
  return todayEventDay();
}

/** Advance active event day by one calendar day. */
export function startNewEventDay(): string {
  const current = getActiveEventDay();
  const nextDate = new Date(`${current}T12:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);
  const next = todayEventDay(nextDate);
  if (isBrowser()) {
    window.localStorage.setItem(EVENT_DAY_OVERRIDE_KEY, next);
  }
  return next;
}
