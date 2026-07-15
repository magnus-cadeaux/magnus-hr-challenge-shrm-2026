import type { ReactNode } from "react";
import { Text } from "./text";
import { cn } from "@/lib/utils";

interface DisplayProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Display({ children, className, gradient = true }: DisplayProps) {
  return (
    <Text
      variant="display"
      gradient={gradient ? "blue" : "none"}
      className={className}
    >
      {children}
    </Text>
  );
}

interface HeadingProps {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
}

export function Heading({ children, className, level = 2 }: HeadingProps) {
  const as = (`h${level}` as "h1" | "h2" | "h3");
  return (
    <Text
      as={as}
      variant={level === 1 ? "hero" : level === 2 ? "title" : "heading"}
      className={className}
    >
      {children}
    </Text>
  );
}

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <Text variant="eyebrow" className={cn("inline-block", className)}>
      {children}
    </Text>
  );
}

interface CaptionProps {
  children: ReactNode;
  className?: string;
}

export function Caption({ children, className }: CaptionProps) {
  return (
    <Text variant="caption" className={className}>
      {children}
    </Text>
  );
}

interface LeadProps {
  children: ReactNode;
  className?: string;
}

export function Lead({ children, className }: LeadProps) {
  return (
    <Text variant="lead" className={cn("max-w-2xl", className)}>
      {children}
    </Text>
  );
}
