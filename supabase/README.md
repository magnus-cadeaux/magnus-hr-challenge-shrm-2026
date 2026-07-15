# Supabase

## Clients

| Import | Use |
|--------|-----|
| `@/services/supabase` | Browser anon client |
| `@/services/supabase/server` | Server Components / Route Handlers |
| `@/services/supabase/admin` | Service-role (trusted server only) |

## Migrations

Apply in order:

1. `migrations/20260715000000_init_schema.sql`
2. `migrations/20260715000001_rls_policies.sql`
3. `migrations/20260715000002_seed_inventory.sql`

Typed models live in `types/database.ts`.
