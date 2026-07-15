import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-magnus-skeleton rounded-xl bg-white/5", {
  variants: {
    variant: {
      line: "h-4 w-full",
      title: "h-8 w-2/3",
      avatar: "size-12 rounded-full",
      card: "h-40 w-full rounded-2xl",
      button: "h-12 w-32 rounded-xl",
      circle: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}

export function SkeletonGroup({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton variant="title" />
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={index === lines - 1 ? "w-4/5" : undefined}
        />
      ))}
    </div>
  );
}

export { skeletonVariants };
