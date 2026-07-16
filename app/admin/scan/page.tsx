import type { Metadata } from "next";
import { QuickScanView } from "@/features/admin/quick-scan";

export const metadata: Metadata = {
  title: "Quick Contact Scan",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminScanPage() {
  return <QuickScanView />;
}
