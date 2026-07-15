import * as React from "react";
import { cn } from "@/lib/utils";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center",
        inline ? "inline-flex" : "w-full",
        className,
      )}
      {...props}
    />
  ),
);
Center.displayName = "Center";
