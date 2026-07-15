"use client";

import { BREAKPOINTS } from "@/lib/constants";
import { useMediaQuery } from "./use-media-query";

export function useIsIpad() {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.ipad}px) and (max-width: 1366px)`,
  );
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}
