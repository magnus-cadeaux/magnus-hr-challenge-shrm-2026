"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";
import { Stack } from "@/components/layout";
import { cn } from "@/lib/utils";
import { parseVCard, type BadgeScanFields } from "../lib/parse-vcard";

const SCAN_FAIL_MESSAGE =
  "Couldn't read that, try again or enter manually";

interface BadgeScanPanelProps {
  onScan: (fields: BadgeScanFields) => void;
  reduceMotion?: boolean;
}

export function BadgeScanPanel({ onScan }: BadgeScanPanelProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<"none" | "denied" | "fail" | "success">(
    "none",
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const lastFailAtRef = useRef(0);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const stopCamera = useCallback(() => {
    activeRef.current = false;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const stream = streamRef.current;
    streamRef.current = null;
    stream?.getTracks().forEach((track) => track.stop());
    const video = videoRef.current;
    if (video) video.srcObject = null;
  }, []);

  useEffect(() => {
    if (!open) {
      stopCamera();
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setOpen(false);
      setMessage("fail");
      return;
    }

    let cancelled = false;

    const tick = () => {
      if (!activeRef.current || cancelled) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (
        !video ||
        !canvas ||
        video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA
      ) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;
      if (width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code?.data) {
        const fields = parseVCard(code.data);
        if (fields) {
          activeRef.current = false;
          stopCamera();
          setOpen(false);
          onScanRef.current(fields);
          setMessage("success");
          return;
        }

        const now = Date.now();
        if (now - lastFailAtRef.current > 2500) {
          lastFailAtRef.current = now;
          setMessage("fail");
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          stream.getTracks().forEach((track) => track.stop());
          setOpen(false);
          setMessage("fail");
          return;
        }

        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        video.muted = true;
        await video.play();

        if (cancelled) {
          stopCamera();
          return;
        }

        activeRef.current = true;
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) {
          stopCamera();
          setOpen(false);
          setMessage("denied");
        }
      }
    })();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [open, stopCamera]);

  return (
    <Stack gap="sm" className="w-full">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="gap-2"
          onClick={() => {
            if (open) {
              setOpen(false);
              return;
            }
            setMessage("none");
            setOpen(true);
          }}
        >
          <Camera className="size-4" aria-hidden />
          {open ? "Close Scanner" : "Scan Badge"}
        </Button>
        <Text variant="caption" className="text-muted-foreground">
          Or enter your details manually below
        </Text>
      </div>

      {message === "denied" ? (
        <Text variant="caption" className="text-muted-foreground">
          Camera unavailable — continue with the form below.
        </Text>
      ) : null}

      {message === "fail" ? (
        <Text variant="caption" className="text-amber-200/90">
          {SCAN_FAIL_MESSAGE}
        </Text>
      ) : null}

      {message === "success" ? (
        <Text variant="caption" className="text-emerald-300/90">
          Badge details filled in — review and continue when ready.
        </Text>
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40",
          open ? "block" : "hidden",
        )}
      >
        <video
          ref={videoRef}
          className="aspect-[4/3] w-full bg-black object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="hidden" aria-hidden />
        <button
          type="button"
          onClick={() => setOpen(false)}
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
