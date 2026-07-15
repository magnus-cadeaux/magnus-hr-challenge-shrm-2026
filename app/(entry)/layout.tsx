import type { ReactNode } from "react";

export default function EntryLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="relative min-h-dvh overflow-hidden">{children}</div>;
}
