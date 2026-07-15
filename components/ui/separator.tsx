"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const separatorVariants = cva("shrink-0", {
  variants: {
    tone: {
      default: "bg-border",
      subtle: "bg-border-subtle",
      strong: "bg-border-strong",
      glow: "bg-gradient-to-r from-transparent via-blue-400/40 to-transparent",
      achievement:
        "bg-gradient-to-r from-transparent via-achievement/50 to-transparent",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      tone,
      ...props
    },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ tone }),
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };
