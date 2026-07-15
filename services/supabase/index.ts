/**
 * Browser-safe Supabase exports only.
 * Server: `@/services/supabase/server`
 * Service role: `@/services/supabase/admin`
 */
export { getSupabaseBrowserClient, createBrowserClient } from "./client";
export type { TypedSupabaseClient } from "./client";
