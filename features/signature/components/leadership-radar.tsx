"use client";

import { useMemo } from "react";
import { m } from "framer-motion";
import { Text } from "@/components/typography";
import { durations, easings } from "@/lib/design-system/motion";
import {
  PROFILE_DIMENSIONS,
  PROFILE_DIMENSION_LABELS,
  type ProfileScores,
} from "../engine/types";

interface LeadershipRadarProps {
  scores: ProfileScores;
  reduceMotion?: boolean;
  size?: number;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

export function LeadershipRadar({
  scores,
  reduceMotion = false,
  size = 320,
}: LeadershipRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.34;

  const points = useMemo(() => {
    return PROFILE_DIMENSIONS.map((dimension, index) => {
      const angle = (360 / PROFILE_DIMENSIONS.length) * index;
      const value = Math.max(scores[dimension], 8) / 100;
      return polarToCartesian(cx, cy, maxRadius * value, angle);
    });
  }, [scores, cx, cy, maxRadius]);

  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="mx-auto w-full max-w-md">
      <Text variant="heading" className="mb-4 text-center">
        Leadership Radar
      </Text>
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {rings.map((ring) => (
            <polygon
              key={ring}
              fill="none"
              stroke="rgba(148,163,184,0.14)"
              strokeWidth="1"
              points={PROFILE_DIMENSIONS.map((_, index) => {
                const angle = (360 / PROFILE_DIMENSIONS.length) * index;
                const point = polarToCartesian(
                  cx,
                  cy,
                  maxRadius * ring,
                  angle,
                );
                return `${point.x},${point.y}`;
              }).join(" ")}
            />
          ))}

          {PROFILE_DIMENSIONS.map((dimension, index) => {
            const angle = (360 / PROFILE_DIMENSIONS.length) * index;
            const edge = polarToCartesian(cx, cy, maxRadius, angle);
            const label = polarToCartesian(cx, cy, maxRadius + 28, angle);
            return (
              <g key={dimension}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={edge.x}
                  y2={edge.y}
                  stroke="rgba(148,163,184,0.16)"
                  strokeWidth="1"
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-silver-400"
                  style={{ fontSize: 10 }}
                >
                  {PROFILE_DIMENSION_LABELS[dimension].split(" ")[0]}
                </text>
              </g>
            );
          })}

          <m.polygon
            points={polygon}
            fill="rgba(59,130,246,0.18)"
            stroke="rgba(96,165,250,0.85)"
            strokeWidth="2"
            initial={
              reduceMotion
                ? { opacity: 1, pathLength: 1 }
                : { opacity: 0, scale: 0.7 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0.2 : durations.dramatic,
              ease: easings.outExpo,
              delay: reduceMotion ? 0 : 0.2,
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {points.map((point, index) => (
            <m.circle
              key={PROFILE_DIMENSIONS[index]}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#93c5fd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: reduceMotion ? 0 : 0.45 + index * 0.05,
                duration: durations.slow,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
