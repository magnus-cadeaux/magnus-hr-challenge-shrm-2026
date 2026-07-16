"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { parseVCard, type BadgeScanFields } from "../lib/parse-vcard";

export type BadgeScannerMessage = "none" | "denied" | "fail" | "success";

export interface UseBadgeScannerOptions {
  onScan: (fields: BadgeScanFields) => void;
}

/**
 * Shared camera + jsQR badge scanning loop used by registration and staff quick scan.
 */
export function useBadgeScanner({ onScan }: UseBadgeScannerOptions) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<BadgeScannerMessage>("none");
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

  const start = useCallback(() => {
    setMessage("none");
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const resetMessage = useCallback(() => {
    setMessage("none");
  }, []);

  return {
    open,
    message,
    videoRef,
    canvasRef,
    start,
    close,
    resetMessage,
    setMessage,
  } as const;
}
