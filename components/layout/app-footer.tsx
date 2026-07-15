import { APP_NAME, EVENT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppFooterProps {
  className?: string;
}

export function AppFooter({ className }: AppFooterProps) {
  return (
    <footer
      className={cn(
        "relative z-10 border-t border-border/40 py-8 text-center",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        {APP_NAME}
        <span className="mx-2 text-border">·</span>
        {EVENT_NAME}
      </p>
    </footer>
  );
}
