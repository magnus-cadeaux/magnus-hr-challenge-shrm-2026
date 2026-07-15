"use client";

import { useEffect, type ReactNode } from "react";
import { OfflineBanner } from "@/components/system/offline-banner";
import { useKioskIdle } from "@/hooks/use-kiosk-idle";
import { startSyncRuntime, stopSyncRuntime } from "@/services/sync";

interface ProductionRuntimeProps {
  children: ReactNode;
}

/**
 * Boots offline sync + kiosk idle protection without changing feature UIs.
 */
export function ProductionRuntime({ children }: ProductionRuntimeProps) {
  useKioskIdle();

  useEffect(() => {
    startSyncRuntime();
    return () => stopSyncRuntime();
  }, []);

  return (
    <>
      <OfflineBanner />
      {children}
    </>
  );
}
