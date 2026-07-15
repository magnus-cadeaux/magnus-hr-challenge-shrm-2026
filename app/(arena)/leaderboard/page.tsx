import type { Metadata } from "next";
import { LeaderboardView } from "@/features/leaderboard";

export const metadata: Metadata = {
  title: "Live Arena",
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
