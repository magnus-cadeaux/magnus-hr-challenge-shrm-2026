"use client";

import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { Text } from "@/components/typography";
import { ROUTES } from "@/lib/constants";
import { useLiveClock } from "../hooks/use-live-clock";

interface AdminHeaderProps {
  eventName: string;
}

export function AdminHeader({ eventName }: AdminHeaderProps) {
  const { time, day } = useLiveClock();

  return (
    <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Text variant="eyebrow" className="mb-2 text-blue-200/70">
          Operations
        </Text>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <BrandMark size="sm" />
          <Text variant="display" gradient="blue" className="tracking-tight">
            Control Center
          </Text>
        </div>
        <Text variant="subtitle" className="mt-2 text-lg">
          Event · {eventName}
        </Text>
        <Link
          href={ROUTES.adminScan}
          className="mt-4 inline-flex text-sm font-semibold text-blue-300 transition-colors hover:text-white"
        >
          Quick Contact Scan →
        </Link>
      </div>
      <div className="flex flex-wrap gap-8 lg:text-right">
        <div>
          <Text variant="micro" className="mb-1.5 text-muted-foreground">
            Current Time
          </Text>
          <Text
            as="div"
            className="font-display text-3xl font-bold tabular-nums tracking-tight md:text-4xl"
          >
            {time}
          </Text>
        </div>
        <div>
          <Text variant="micro" className="mb-1.5 text-muted-foreground">
            Current Day
          </Text>
          <Text as="div" className="text-lg font-semibold text-blue-50 md:text-xl">
            {day}
          </Text>
        </div>
      </div>
    </header>
  );
}
