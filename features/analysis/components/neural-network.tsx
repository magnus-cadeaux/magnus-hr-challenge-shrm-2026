"use client";

import { useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

type Node = { id: number; x: number; y: number };

function buildNodes(count: number): Node[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const radius = 28 + (index % 5) * 8;
    return {
      id: index,
      x: 50 + Math.cos(angle) * radius * 0.75,
      y: 50 + Math.sin(angle) * radius * 0.55,
    };
  });
}

interface NeuralNetworkProps {
  progress: number;
  reduceMotion?: boolean;
  className?: string;
}

export function NeuralNetwork({
  progress,
  reduceMotion = false,
  className,
}: NeuralNetworkProps) {
  const nodes = useMemo(() => buildNodes(16), []);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setPulse((value) => (value + 1) % 1000);
    }, 80);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const visibleNodes = Math.max(3, Math.floor((progress / 100) * nodes.length));
  const activeNodes = nodes.slice(0, visibleNodes);

  const links: Array<[Node, Node]> = [];
  for (let i = 0; i < activeNodes.length; i += 1) {
    for (let j = i + 1; j < activeNodes.length; j += 1) {
      if ((i + j + pulse) % 3 === 0 || j === i + 1) {
        links.push([activeNodes[i], activeNodes[j]]);
      }
    }
  }

  return (
    <div
      className={cn("relative mx-auto aspect-square w-full max-w-md", className)}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="size-full">
        {links.map(([a, b], index) => (
          <m.line
            key={`${a.id}-${b.id}-${index}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(96, 165, 250, 0.28)"
            strokeWidth="0.35"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduceMotion ? 0.35 : [0.15, 0.45, 0.2] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ))}
        {activeNodes.map((node, index) => (
          <m.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={reduceMotion ? 1.2 : 1.1 + (index % 3) * 0.15}
            fill="rgba(147, 197, 253, 0.9)"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: reduceMotion ? 1 : [1, 1.25, 1],
            }}
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : {
                    duration: 2.4 + (index % 4) * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.05,
                  }
            }
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  );
}
