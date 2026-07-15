"use client";

import { useEffect, useState } from "react";
import { isBrowser } from "@/utils/device";

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!isBrowser()) return;

    const update = () => setIsOffline(!window.navigator.onLine);
    update();

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return { isOffline, isOnline: !isOffline } as const;
}
