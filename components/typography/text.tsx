import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      display:
        "font-display text-[length:var(--text-display)] font-extrabold leading-[var(--leading-tight)] tracking-[var(--tracking-tighter)] text-balance",
      hero: "font-display text-[length:var(--text-hero)] font-extrabold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-balance",
      title:
        "font-display text-[length:var(--text-title)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-snug)] text-balance",
      heading:
        "font-display text-[length:var(--text-heading)] font-semibold leading-[var(--leading-snug)] tracking-[var(--tracking-snug)]",
      subtitle:
        "text-[length:var(--text-subtitle)] font-medium leading-[var(--leading-relaxed)] text-muted-foreground text-pretty",
      lead: "text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-relaxed)] text-muted-foreground text-pretty",
      body: "text-[length:var(--text-body)] font-normal leading-[var(--leading-normal)]",
      "body-sm":
        "text-[length:var(--text-body-sm)] font-normal leading-[var(--leading-normal)] text-muted-foreground",
      caption:
        "text-[length:var(--text-caption)] font-medium leading-[var(--leading-normal)] text-muted-foreground",
      micro:
        "text-[length:var(--text-micro)] font-semibold uppercase tracking-[var(--tracking-wider)] text-muted-foreground",
      eyebrow:
        "text-[length:var(--text-micro)] font-semibold uppercase tracking-[var(--tracking-widest)] text-blue-300",
    },
    gradient: {
      none: "",
      blue: "text-gradient-blue",
      gold: "text-gradient-gold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "body",
    gradient: "none",
    align: "left",
  },
});

type TextElement = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "label";

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: TextElement;
}

const defaultElement: Record<NonNullable<TextProps["variant"]>, TextElement> = {
  display: "h1",
  hero: "h1",
  title: "h2",
  heading: "h3",
  subtitle: "p",
  lead: "p",
  body: "p",
  "body-sm": "p",
  caption: "p",
  micro: "span",
  eyebrow: "span",
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant = "body", gradient, align, as, ...props }, ref) => {
    const Comp = as ?? defaultElement[variant ?? "body"];
    return (
      <Comp
        ref={ref as never}
        className={cn(textVariants({ variant, gradient, align }), className)}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { textVariants };
