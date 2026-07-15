import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block animate-magnus-spin rounded-full border-solid border-current border-r-transparent",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-6 border-2",
        lg: "size-8 border-[3px]",
        xl: "size-12 border-4",
      },
      tone: {
        default: "text-blue-400",
        muted: "text-muted-foreground",
        white: "text-white",
        achievement: "text-achievement",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
    },
  },
);

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({
  className,
  size,
  tone,
  label = "Loading",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size, tone }), className)}
      {...props}
    />
  );
}

export { spinnerVariants };
