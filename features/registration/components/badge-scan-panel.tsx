"use client";

import { BadgeScanner } from "@/features/badge-scan";
import type { BadgeScanFields } from "@/features/badge-scan";

interface BadgeScanPanelProps {
  onScan: (fields: BadgeScanFields) => void;
  reduceMotion?: boolean;
}

/** Registration-flavored wrapper around the shared badge scanner. */
export function BadgeScanPanel({ onScan }: BadgeScanPanelProps) {
  return (
    <BadgeScanner
      onScan={onScan}
      buttonLabel="Scan Badge"
      buttonSize="lg"
      failMessage="Couldn't read that, try again or enter manually"
      successMessage="Badge details filled in — review and continue when ready."
      deniedMessage="Camera unavailable — continue with the form below."
      idleHint="Or enter your details manually below"
    />
  );
}
