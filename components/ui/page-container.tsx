"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { pageTransition } from "@/animations/page-transition";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  withPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  narrow = false,
  withPadding = true,
}: PageContainerProps) {
  return (
    <m.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "relative z-10 min-h-dvh w-full",
        withPadding && "py-10 md:py-14 lg:py-16",
        narrow ? "container-narrow" : "container-page",
        className,
      )}
    >
      {children}
    </m.main>
  );
}
