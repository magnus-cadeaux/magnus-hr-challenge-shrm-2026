"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { slideUpVariants } from "@/animations/slide";
import { cn } from "@/lib/utils";
import { Eyebrow, Text } from "@/components/typography";

interface SectionTitleProps {
  children: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  children,
  eyebrow,
  description,
  className,
  align = "left",
}: SectionTitleProps) {
  return (
    <m.div
      variants={slideUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Text variant="title" align={align}>
        {children}
      </Text>
      {description ? (
        <Text variant="lead" align={align} className="max-w-xl">
          {description}
        </Text>
      ) : null}
    </m.div>
  );
}
