"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { heroReveal } from "@/animations/hero";
import { cn } from "@/lib/utils";
import { Text } from "@/components/typography";

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  as?: "h1" | "h2";
}

export function HeroTitle({
  children,
  className,
  gradient = true,
  as = "h1",
}: HeroTitleProps) {
  const Component = m[as];

  return (
    <Component
      variants={heroReveal.item}
      initial="hidden"
      animate="visible"
      className={cn(className)}
    >
      <Text
        as="span"
        variant="hero"
        gradient={gradient ? "blue" : "none"}
        className="block"
      >
        {children}
      </Text>
    </Component>
  );
}
