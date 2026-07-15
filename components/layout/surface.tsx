import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("relative", {
  variants: {
    variant: {
      plain: "bg-transparent",
      muted: "bg-muted/60",
      glass: "glass",
      "glass-subtle": "glass-subtle",
      "glass-strong": "glass-strong",
      "glass-panel": "glass-panel",
      "glass-border": "glass-border-gradient",
      solid: "bg-navy-850 border border-border",
      achievement: "border border-achievement/30 bg-achievement/10",
    },
    radius: {
      none: "rounded-none",
      md: "rounded-xl",
      lg: "rounded-2xl",
      xl: "rounded-3xl",
      full: "rounded-full",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8 md:p-10",
      xl: "p-10 md:p-12",
    },
    interactive: {
      true: "glass-interactive",
      false: "",
    },
  },
  defaultVariants: {
    variant: "glass",
    radius: "lg",
    padding: "md",
    interactive: false,
  },
});

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant, radius, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        surfaceVariants({ variant, radius, padding, interactive }),
        className,
      )}
      {...props}
    />
  ),
);
Surface.displayName = "Surface";

export { surfaceVariants };
