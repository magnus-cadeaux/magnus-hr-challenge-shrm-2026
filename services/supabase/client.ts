import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

/**
 * Browser Supabase client (anon key). Returns null when env is not configured —
 * the app degrades gracefully to local/offline mode.
 *
 * Table shapes are documented in `@/types/database`.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL as string,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        realtime: {
          params: { eventsPerSecond: 8 },
        },
      },
    );
  }

  return browserClient;
}

export type TypedSupabaseClient = SupabaseClient;

/** @deprecated Prefer getSupabaseBrowserClient */
export const createBrowserClient = getSupabaseBrowserClient;
