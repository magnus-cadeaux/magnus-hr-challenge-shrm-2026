"use client";

import { useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";
import { Stack } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  useBadgeScanner,
  type BadgeScannerMessage,
} from "../hooks/use-badge-scanner";
import type { BadgeScanFields } from "../lib/parse-vcard";

export interface BadgeScannerProps {
  onScan: (fields: BadgeScanFields) => void;
  /** Primary CTA label when the camera is closed. */
  buttonLabel?: string;
  buttonSize?: "lg" | "xl";
  failMessage?: string;
  successMessage?: string | null;
  deniedMessage?: string;
  idleHint?: string | null;
  className?: string;
  /** Bump to clear success/fail messaging after the parent resets. */
  clearMessageKey?: number;
}

const DEFAULT_FAIL = "Couldn't read that, try again or enter manually";

export function BadgeScanner({
  onScan,
  buttonLabel = "Scan Badge",
  buttonSize = "lg",
  failMessage = DEFAULT_FAIL,
  successMessage = null,
  deniedMessage = "Camera unavailable — continue with the form below.",
  idleHint = "Or enter your details manually below",
  className,
  clearMessageKey = 0,
}: BadgeScannerProps) {
  const scanner = useBadgeScanner({ onScan });

  useEffect(() => {
    if (clearMessageKey > 0) scanner.resetMessage();
    // Only react to explicit parent resets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearMessageKey]);

  return (
    <Stack gap="sm" className={cn("w-full", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size={buttonSize}
          className="gap-2"
          onClick={() => {
            if (scanner.open) {
              scanner.close();
              return;
            }
            scanner.start();
          }}
        >
          <Camera className="size-5" aria-hidden />
          {scanner.open ? "Close Scanner" : buttonLabel}
        </Button>
        {idleHint && !scanner.open ? (
          <Text variant="caption" className="text-muted-foreground">
            {idleHint}
          </Text>
        ) : null}
      </div>

      <ScannerStatus
        message={scanner.message}
        failMessage={failMessage}
        successMessage={successMessage}
        deniedMessage={deniedMessage}
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40",
          scanner.open ? "block" : "hidden",
        )}
      >
        <video
          ref={scanner.videoRef}
          className="aspect-[4/3] w-full bg-black object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={scanner.canvasRef} className="hidden" aria-hidden />
        <button
          type="button"
          onClick={scanner.close}
          className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
          aria-label="Close badge scanner"
        >
          <X className="size-4" />
        </button>
        <Text
          variant="micro"
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-center text-blue-100"
        >
          Hold the badge QR in frame
        </Text>
      </div>
    </Stack>
  );
}

function ScannerStatus({
  message,
  failMessage,
  successMessage,
  deniedMessage,
}: {
  message: BadgeScannerMessage;
  failMessage: string;
  successMessage: string | null;
  deniedMessage: string;
}) {
  if (message === "denied") {
    return (
      <Text variant="caption" className="text-muted-foreground">
        {deniedMessage}
      </Text>
    );
  }
  if (message === "fail") {
    return (
      <Text variant="caption" className="text-amber-200/90">
        {failMessage}
      </Text>
    );
  }
  if (message === "success" && successMessage) {
    return (
      <Text variant="caption" className="text-emerald-300/90">
        {successMessage}
      </Text>
    );
  }
  return null;
}
