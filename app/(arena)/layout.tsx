import type { ReactNode } from "react";

export default function ArenaLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="relative min-h-dvh overflow-x-hidden">{children}</div>;
}
