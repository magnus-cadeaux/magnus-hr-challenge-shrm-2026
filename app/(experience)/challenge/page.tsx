import type { Metadata } from "next";
import { ChallengeView } from "@/features/challenge";

export const metadata: Metadata = {
  title: "Challenge",
};

export default function ChallengePage() {
  return <ChallengeView />;
}
