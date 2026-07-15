import type { Metadata } from "next";
import { RewardView } from "@/features/reward";

export const metadata: Metadata = {
  title: "Reward",
};

export default function RewardPage() {
  return <RewardView />;
}
