"use client";

import { useOfflineStatus } from "@/hooks/use-offline-status";
import { cn } from "@/lib/utils";

/**
 * Minimal production system banner — shown only while the device is offline.
 */
export function OfflineBanner() {
  const { isOffline } = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3",
      )}
    >
      <div className="rounded-full border border-white/10 bg-navy-950/90 px-4 py-2 text-xs font-medium text-blue-100/90 shadow-lg backdrop-blur-md">
        You are offline. Progress is saved on this device and will sync
        automatically.
      </div>
    </div>
  );
}
