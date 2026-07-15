import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      page: "max-w-[var(--max-content)] px-5 sm:px-8 md:px-[var(--ipad-gutter)] lg:px-10",
      wide: "max-w-[var(--max-wide)] px-5 sm:px-8 md:px-[var(--ipad-gutter)] lg:px-10",
      narrow: "max-w-[var(--max-narrow)] px-5 sm:px-8",
      form: "max-w-[var(--max-form)] px-5 sm:px-6",
      full: "max-w-none px-5 sm:px-8",
    },
  },
  defaultVariants: {
    size: "page",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  ),
);
Container.displayName = "Container";

export { containerVariants };
