import type { ReactNode } from "react";

export default function RevealLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="relative min-h-dvh overflow-x-hidden">{children}</div>;
}
