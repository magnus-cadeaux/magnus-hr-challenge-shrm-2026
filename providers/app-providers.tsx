"use client";

import type { ReactNode } from "react";
import { MotionProvider } from "./motion-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ProductionRuntime } from "./production-runtime";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MotionProvider>
          <ProductionRuntime>{children}</ProductionRuntime>
        </MotionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
