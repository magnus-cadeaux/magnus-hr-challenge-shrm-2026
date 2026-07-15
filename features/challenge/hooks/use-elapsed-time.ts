"use client";

import { useEffect, useState } from "react";

export function useElapsedTime(startedAt?: string, running = true) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!startedAt || !running) return;

    const start = new Date(startedAt).getTime();
    const tick = () => setElapsedMs(Math.max(0, Date.now() - start));
    tick();

    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt, running]);

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    elapsedMs,
    label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  } as const;
}
