import type { Metadata } from "next";
import { SignatureView } from "@/features/signature";

export const metadata: Metadata = {
  title: "HR Signature",
};

export default function SignaturePage() {
  return <SignatureView />;
}
