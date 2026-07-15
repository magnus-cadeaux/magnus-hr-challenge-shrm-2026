"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { m } from "framer-motion";
import * as React from "react";
import { buttonPress } from "@/animations/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight transition-[color,background,box-shadow,filter,transform] duration-200 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-blue text-primary-foreground shadow-glow hover:brightness-110",
        secondary: "glass text-foreground hover:bg-white/5",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-white/5",
        ghost: "bg-transparent text-foreground hover:bg-white/5",
        soft: "bg-primary/15 text-blue-200 hover:bg-primary/25",
        link: "h-auto rounded-none bg-transparent px-0 text-blue-300 underline-offset-4 hover:underline",
        achievement:
          "bg-gradient-gold text-achievement-foreground shadow-gold hover:brightness-105",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "size-12 rounded-xl",
        "icon-sm": "size-10 rounded-lg",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  motionDisabled?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      motionDisabled = false,
      loading = false,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const classes = cn(buttonVariants({ variant, size, className }));

    const content = (
      <>
        {loading ? <Spinner size="sm" tone="white" label="Loading" /> : null}
        {children}
      </>
    );

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    if (motionDisabled || loading) {
      return (
        <button
          type={type}
          className={classes}
          ref={ref}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          {...props}
        >
          {content}
        </button>
      );
    }

    return (
      <m.button
        type={type}
        className={classes}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...buttonPress}
        {...(props as React.ComponentPropsWithoutRef<typeof m.button>)}
      >
        {content}
      </m.button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
