import type { Metadata } from "next";
import { RegistrationView } from "@/features/registration";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <RegistrationView />;
}
