import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const clusterVariants = cva("flex flex-wrap", {
  variants: {
    gap: {
      xs: "gap-1.5",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
  },
  defaultVariants: {
    gap: "sm",
    align: "center",
  },
});

export interface ClusterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof clusterVariants> {}

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  ({ className, gap, align, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(clusterVariants({ gap, align }), className)}
      {...props}
    />
  ),
);
Cluster.displayName = "Cluster";
