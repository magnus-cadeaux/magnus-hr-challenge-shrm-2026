export type AppTheme = "dark" | "light" | "system";

export type PageMeta = {
  title: string;
  description: string;
};

export type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
};

export type FeatureModule =
  | "landing"
  | "registration"
  | "challenge"
  | "analysis"
  | "signature"
  | "reward"
  | "leaderboard"
  | "sales"
  | "admin";
