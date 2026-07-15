import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientBackgroundVariants = cva(
  "pointer-events-none absolute inset-0 overflow-hidden",
  {
    variants: {
      variant: {
        hero: "",
        arena: "",
        minimal: "",
        achievement: "",
      },
    },
    defaultVariants: {
      variant: "hero",
    },
  },
);

export interface GradientBackgroundProps
  extends VariantProps<typeof gradientBackgroundVariants> {
  className?: string;
  withOrb?: boolean;
}

export function GradientBackground({
  className,
  withOrb = true,
  variant = "hero",
}: GradientBackgroundProps) {
  return (
    <div
      className={cn(gradientBackgroundVariants({ variant }), className)}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-hero" />
      {variant === "minimal" ? null : (
        <div className="absolute inset-0 bg-gradient-radial-glow" />
      )}
      {variant === "arena" ? (
        <div className="absolute inset-0 bg-gradient-radial-center" />
      ) : null}
      {variant === "achievement" ? (
        <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14),transparent_60%)]" />
      ) : null}
      {withOrb && variant !== "minimal" ? (
        <>
          <div className="orb-blue absolute -left-24 top-24 size-[28rem] blur-3xl" />
          <div className="orb-cyan absolute -right-16 bottom-10 size-[22rem] blur-3xl" />
        </>
      ) : null}
    </div>
  );
}

export { gradientBackgroundVariants };
