"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { slideUpVariants } from "@/animations/slide";
import { cn } from "@/lib/utils";
import { Text } from "@/components/typography";

interface SubtitleProps {
  children: ReactNode;
  className?: string;
}

export function Subtitle({ children, className }: SubtitleProps) {
  return (
    <m.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      className={cn("max-w-2xl", className)}
    >
      <Text variant="subtitle">{children}</Text>
    </m.div>
  );
}
