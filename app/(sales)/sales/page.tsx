import type { Metadata } from "next";
import { SalesView } from "@/features/sales";

export const metadata: Metadata = {
  title: "Sales Companion",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SalesPage() {
  return <SalesView />;
}
