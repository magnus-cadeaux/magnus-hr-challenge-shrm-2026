import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Magnus HR Challenge"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_EVENT_NAME: z.string().default("SHRM Hyderabad 2026"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  /** Explicit opt-in for fake arena simulation — never the default. */
  NEXT_PUBLIC_DEMO_MODE: z
    .enum(["true", "false", ""])
    .optional()
    .or(z.literal("")),
});

/** Server-only secrets — never import this schema into client bundles. */
export const serverSecretSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional().or(z.literal("")),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function readEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_EVENT_NAME: process.env.NEXT_PUBLIC_EVENT_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  });

  if (!parsed.success) {
    console.warn("[env] Invalid public environment configuration", parsed.error.flatten());
    return {
      NEXT_PUBLIC_APP_NAME: "Magnus HR Challenge",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_EVENT_NAME: "SHRM Hyderabad 2026",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      NEXT_PUBLIC_DEMO_MODE: "",
    };
  }

  return parsed.data;
}

export const env = readEnv();

export function isSupabaseConfigured(): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Fake leaderboard simulation — only when explicitly set to "true". */
export function isDemoMode(): boolean {
  return env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/** Validates shape only — does not leak values to logs. */
export function assertProductionEnv(): {
  ok: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (
    typeof window === "undefined" &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  return { ok: missing.length === 0, missing };
}
