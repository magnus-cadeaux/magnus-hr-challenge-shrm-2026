"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { pageTransition } from "@/animations/page-transition";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <m.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-1 flex-col"
    >
      {children}
    </m.div>
  );
}
