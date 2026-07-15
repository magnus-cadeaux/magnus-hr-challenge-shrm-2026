"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import {
  fadeVariants,
  slideUpVariants,
  scaleVariants,
  blurInVariants,
  revealVariants,
  staggerContainer,
  staggerItemFadeUp,
} from "@/animations";
import { cn } from "@/lib/utils";

type MotionBaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
};

function withDelay(delay?: number) {
  return delay
    ? { transition: { delay } }
    : undefined;
}

export function FadeIn({
  children,
  className,
  delay,
  once = true,
  ...props
}: MotionBaseProps & HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={fadeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={className}
      {...withDelay(delay)}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function SlideIn({
  children,
  className,
  delay,
  once = true,
  ...props
}: MotionBaseProps & HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={slideUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={className}
      {...withDelay(delay)}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function ScaleIn({
  children,
  className,
  delay,
  once = true,
  ...props
}: MotionBaseProps & HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={scaleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={className}
      {...withDelay(delay)}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function BlurIn({
  children,
  className,
  delay,
  once = true,
  ...props
}: MotionBaseProps & HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={blurInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={className}
      {...withDelay(delay)}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function Reveal({
  children,
  className,
  delay,
  once = true,
  ...props
}: MotionBaseProps & HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={cn("overflow-hidden", className)}
      {...withDelay(delay)}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function Stagger({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & HTMLMotionProps<"div">) {
  return (
    <m.div variants={staggerItemFadeUp} className={className} {...props}>
      {children}
    </m.div>
  );
}
