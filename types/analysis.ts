import type { WithIdAndTimestamps } from "./common";

export interface AnalysisDimension {
  key: string;
  label: string;
  score: number;
  maxScore: number;
}

export type AnalysisResult = WithIdAndTimestamps & {
  participantId: string;
  sessionId: string;
  overallScore: number;
  percentile?: number;
  dimensions: AnalysisDimension[];
  summary: string;
};
