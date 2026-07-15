import { BREAKPOINTS } from "@/lib/constants";

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getViewportWidth(): number {
  if (!isBrowser()) return 0;
  return window.innerWidth;
}

export function isIpadViewport(width = getViewportWidth()): boolean {
  return width >= BREAKPOINTS.ipad && width <= 1366;
}

export function isTouchDevice(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
