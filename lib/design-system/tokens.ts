/**
 * Magnus Design System — typed token access for TypeScript consumers.
 * CSS remains source of truth in styles/tokens.css.
 */

export const colors = {
  navy: {
    950: "#030712",
    900: "#0a1224",
    850: "#0d1830",
    800: "#122040",
    700: "#1a2f5a",
    600: "#243a6b",
  },
  blue: {
    600: "#2563eb",
    500: "#3b82f6",
    400: "#60a5fa",
    300: "#93c5fd",
    200: "#bfdbfe",
  },
  cyan: {
    400: "#22d3ee",
    300: "#67e8f9",
  },
  gold: {
    600: "#b8860b",
    500: "#d4af37",
    400: "#e8c547",
    300: "#f0d875",
  },
  silver: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
  },
  semantic: {
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#38bdf8",
  },
} as const;

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  section: "5rem",
  sectionSm: "3.5rem",
  stack: "1.5rem",
  stackLg: "2.5rem",
  inline: "1.25rem",
  gutter: "2rem",
  card: "1.5rem",
  cardLg: "2rem",
} as const;

export const radii = {
  none: "0",
  xs: "0.375rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.75rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

export const typography = {
  display: "var(--text-display)",
  hero: "var(--text-hero)",
  title: "var(--text-title)",
  heading: "var(--text-heading)",
  subtitle: "var(--text-subtitle)",
  bodyLg: "var(--text-body-lg)",
  body: "var(--text-body)",
  bodySm: "var(--text-body-sm)",
  caption: "var(--text-caption)",
  micro: "var(--text-micro)",
} as const;

export const shadows = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  soft: "var(--shadow-soft)",
  md: "var(--shadow-md)",
  lift: "var(--shadow-lift)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  glow: "var(--shadow-glow)",
  glowSm: "var(--shadow-glow-sm)",
  glowLg: "var(--shadow-glow-lg)",
  gold: "var(--shadow-gold)",
  goldLg: "var(--shadow-gold-lg)",
  focus: "var(--shadow-focus)",
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 40,
  sticky: 50,
  overlay: 60,
  modal: 70,
  toast: 80,
  max: 100,
} as const;

export const layout = {
  maxContent: "72rem",
  maxWide: "80rem",
  maxNarrow: "36rem",
  maxForm: "28rem",
} as const;

export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.15,
    base: 0.25,
    slow: 0.45,
    reveal: 0.7,
    dramatic: 1,
  },
  ease: {
    outExpo: [0.16, 1, 0.3, 1] as const,
    outQuart: [0.25, 1, 0.5, 1] as const,
    inOutSmooth: [0.4, 0, 0.2, 1] as const,
    spring: [0.34, 1.56, 0.64, 1] as const,
  },
  spring: {
    snappy: { type: "spring" as const, stiffness: 420, damping: 28 },
    soft: { type: "spring" as const, stiffness: 220, damping: 26 },
    gentle: { type: "spring" as const, stiffness: 140, damping: 22 },
  },
};

export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radii;
export type TypographyKey = keyof typeof typography;
