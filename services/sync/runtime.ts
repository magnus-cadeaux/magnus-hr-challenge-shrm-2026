import { isBrowser } from "@/utils/device";
import { flushSyncQueue, isSyncAvailable } from "./flush";

let intervalId: number | null = null;
let onlineHandler: (() => void) | null = null;

/**
 * Background sync: polls every 8s + flushes immediately when back online.
 */
export function startSyncRuntime(): void {
  if (!isBrowser() || intervalId !== null) return;

  const tick = () => {
    if (!navigator.onLine || !isSyncAvailable()) return;
    void flushSyncQueue().catch(() => {
      /* never crash the booth */
    });
  };

  onlineHandler = () => tick();
  window.addEventListener("online", onlineHandler);
  intervalId = window.setInterval(tick, 8_000);
  tick();
}

export function stopSyncRuntime(): void {
  if (!isBrowser()) return;
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
  if (onlineHandler) {
    window.removeEventListener("online", onlineHandler);
    onlineHandler = null;
  }
}
