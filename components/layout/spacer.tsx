import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const spacerVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "h-2 w-2",
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
      section: "h-[var(--space-section-sm)] w-full",
    },
    axis: {
      both: "",
      x: "h-0",
      y: "w-0",
    },
  },
  defaultVariants: {
    size: "md",
    axis: "both",
  },
});

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacerVariants> {}

export function Spacer({ className, size, axis, ...props }: SpacerProps) {
  return (
    <div
      aria-hidden
      className={cn(spacerVariants({ size, axis }), className)}
      {...props}
    />
  );
}
