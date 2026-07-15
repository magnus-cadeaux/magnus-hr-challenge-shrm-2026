export function formatChallengeDuration(elapsedMs: number): string {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return "—";
  const totalSeconds = Math.round(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function formatLeadScore(score: number): string {
  return Math.round(score).toString();
}

export function formatConfidenceLabel(
  confidence: "low" | "medium" | "high",
): string {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1);
}

export function formatMaturityLabel(maturity: string): string {
  return maturity.charAt(0).toUpperCase() + maturity.slice(1);
}
