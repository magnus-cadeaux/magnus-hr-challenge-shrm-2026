import type { LucideIcon } from "lucide-react";
import { Building2, Gift, Sprout, Trophy, Zap } from "lucide-react";

export type IdleInsightCard = {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description: string;
  icon: LucideIcon;
  achievement?: boolean;
};

/** Exhibition-floor mock metrics for idle attraction only. */
export const IDLE_INSIGHT_CARDS: IdleInsightCard[] = [
  {
    id: "highest-score",
    label: "Today's Highest Score",
    value: 94,
    suffix: "%",
    description: "Peak decision clarity on the floor today",
    icon: Trophy,
    achievement: true,
  },
  {
    id: "companies",
    label: "Companies Participating",
    value: 47,
    description: "Organizations represented this session",
    icon: Building2,
  },
  {
    id: "rewards",
    label: "Rewards Unlocked",
    value: 128,
    description: "Recognition moments activated today",
    icon: Gift,
    achievement: true,
  },
  {
    id: "avg-score",
    label: "Average Decision Score",
    value: 81,
    suffix: "%",
    description: "Collective judgment across all leaders",
    icon: Zap,
  },
  {
    id: "signature",
    label: "Most Common HR Signature",
    value: 0,
    description: "People Catalyst",
    icon: Sprout,
  },
];

export const IDLE_CARD_INTERVAL_MS = 5000;
export const ENTRY_TRANSITION_MS = 700;
