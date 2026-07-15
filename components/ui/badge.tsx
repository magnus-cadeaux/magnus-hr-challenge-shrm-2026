import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[length:var(--text-micro)] font-semibold tracking-[var(--tracking-wide)] uppercase",
  {
    variants: {
      variant: {
        default: "border-blue-400/25 bg-blue-500/15 text-blue-300",
        secondary: "border-border bg-white/5 text-muted-foreground",
        success: "border-success/25 bg-success/15 text-success",
        warning: "border-warning/25 bg-warning/15 text-warning",
        destructive: "border-destructive/25 bg-destructive/15 text-destructive",
        achievement:
          "border-achievement/30 bg-achievement/15 text-gradient-gold",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
