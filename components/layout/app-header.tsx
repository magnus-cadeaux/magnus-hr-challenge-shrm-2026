import Link from "next/link";
import { APP_NAME, EVENT_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  className?: string;
  compact?: boolean;
}

export function AppHeader({ className, compact = false }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-20 border-b border-border/50 bg-navy-950/40 backdrop-blur-xl",
        className,
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between",
          compact ? "h-14" : "h-16 md:h-18",
        )}
      >
        <Link href={ROUTES.home} className="group flex min-w-0 flex-col">
          <span className="truncate text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-blue-300 md:text-base">
            {APP_NAME}
          </span>
          <span className="truncate text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {EVENT_NAME}
          </span>
        </Link>
      </div>
    </header>
  );
}
