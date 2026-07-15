"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { clearParticipantSession, KIOSK_IDLE_MS } from "@/lib/kiosk";

const STAFF_ROUTES = new Set<string>([
  ROUTES.admin,
  ROUTES.sales,
  ROUTES.leaderboard,
]);

/**
 * Exhibition kiosk protection: after 90s without interaction on participant
 * flows, return to "/" and clear the local participant session.
 */
export function useKioskIdle(idleMs = KIOSK_IDLE_MS) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (STAFF_ROUTES.has(pathname)) {
      return;
    }
    if (pathname === ROUTES.home) return;

    const reset = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        clearParticipantSession();
        router.replace(ROUTES.home);
      }, idleMs);
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "mousemove",
      "scroll",
    ];

    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    reset();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [idleMs, pathname, router]);
}
