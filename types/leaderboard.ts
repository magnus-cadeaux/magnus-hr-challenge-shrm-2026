import type { WithIdAndTimestamps } from "./common";

export type LeaderboardEntry = WithIdAndTimestamps & {
  rank: number;
  participantId: string;
  displayName: string;
  organization: string;
  score: number;
  completedAt: string;
};

export interface LeaderboardSnapshot {
  generatedAt: string;
  entries: LeaderboardEntry[];
  totalParticipants: number;
}
