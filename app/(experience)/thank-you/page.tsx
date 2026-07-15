import type { Metadata } from "next";
import { ThankYouView } from "@/features/landing";

export const metadata: Metadata = {
  title: "Thank you",
};

export default function ThankYouPage() {
  return <ThankYouView />;
}
