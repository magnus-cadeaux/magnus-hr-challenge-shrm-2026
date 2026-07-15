import type { Metadata } from "next";
import { ArenaView } from "@/features/challenge";

export const metadata: Metadata = {
  title: "Arena",
};

export default function ArenaPage() {
  return <ArenaView />;
}
