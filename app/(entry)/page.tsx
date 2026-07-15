import type { Metadata } from "next";
import { EntryExperience } from "@/features/landing";
import { APP_NAME, EVENT_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} · ${EVENT_NAME}`,
  description:
    "A premium interactive installation for senior HR leaders at SHRM Hyderabad 2026.",
};

export default function HomePage() {
  return <EntryExperience />;
}
