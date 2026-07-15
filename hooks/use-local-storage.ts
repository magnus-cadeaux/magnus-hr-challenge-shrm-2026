"use client";

import { useCallback, useEffect, useState } from "react";
import { isBrowser } from "@/utils/device";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isBrowser()) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item != null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // Ignore malformed storage entries
    } finally {
      setHydrated(true);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        if (isBrowser()) {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
        return next;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (isBrowser()) {
      window.localStorage.removeItem(key);
    }
  }, [initialValue, key]);

  return { value: storedValue, setValue, removeValue, hydrated } as const;
}
