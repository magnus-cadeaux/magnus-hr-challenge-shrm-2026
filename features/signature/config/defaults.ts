export const SIGNATURE_PROFILE_DEFAULTS = {
  displayName: "Distinguished Leader",
  organization: "SHRM Hyderabad 2026",
  percentileMin: 8,
  percentileMax: 22,
} as const;

export const ANALYSIS_SEQUENCE = {
  totalMs: 5600,
  reducedMotionMs: 900,
  messages: [
    { atMs: 0, text: "Analysing your HR decisions" },
    { atMs: 1500, text: "Comparing leadership patterns" },
    { atMs: 3000, text: "Identifying your Magnus HR Signature™" },
    { atMs: 4500, text: "Preparing your personalised profile" },
  ],
} as const;
