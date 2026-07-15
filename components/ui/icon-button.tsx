"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "size" | "children"> {
  label: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const sizeMap = {
  sm: "size-10 rounded-lg",
  md: "size-12 rounded-xl",
  lg: "size-14 rounded-2xl",
} as const;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, size = "md", variant = "secondary", ...props }, ref) => (
    <Button
      ref={ref}
      size="icon"
      variant={variant}
      aria-label={label}
      title={label}
      className={cn(sizeMap[size], className)}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
