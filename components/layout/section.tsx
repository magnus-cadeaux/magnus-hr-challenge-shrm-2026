import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-[var(--space-section-sm)]",
      md: "py-[var(--space-section)]",
      lg: "py-24 md:py-32",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing }), className)}
      {...props}
    />
  ),
);
Section.displayName = "Section";
