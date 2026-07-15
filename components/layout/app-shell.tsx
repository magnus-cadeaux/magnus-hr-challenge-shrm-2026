import type { ReactNode } from "react";
import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";
import { GradientBackground } from "@/components/ui/gradient-background";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showParticles?: boolean;
}

export function AppShell({
  children,
  className,
  showHeader = true,
  showFooter = true,
  showParticles = true,
}: AppShellProps) {
  return (
    <div className={cn("relative flex min-h-dvh flex-col", className)}>
      <GradientBackground />
      {showParticles ? <FloatingParticles /> : null}
      {showHeader ? <AppHeader /> : null}
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      {showFooter ? <AppFooter /> : null}
    </div>
  );
}
