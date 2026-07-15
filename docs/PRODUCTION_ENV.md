# Production Environment Guide

## Required variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged admin jobs / exports |
| `NEXT_PUBLIC_APP_URL` | Client + Server | Canonical app URL |
| `NEXT_PUBLIC_APP_NAME` | Client | Brand name |
| `NEXT_PUBLIC_EVENT_NAME` | Client | Event label |
| `NEXT_PUBLIC_DEMO_MODE` | Client | Set to `true` only to force simulated leaderboard cast |

## Validation

Public env is validated via Zod in `lib/env.ts`.

```ts
import { assertProductionEnv, isSupabaseConfigured } from "@/lib/env";
```

If Supabase vars are missing, the app continues in local offline mode (no crash).

## Secrets rule

- Anything with `NEXT_PUBLIC_` is embedded in the browser bundle.
- `SUPABASE_SERVICE_ROLE_KEY` must never use the `NEXT_PUBLIC_` prefix.
- Import `@/services/supabase/admin` only from server code.

## Local vs production

| Mode | Behavior |
|------|----------|
| No Supabase env | Dexie + sessionStorage only; leaderboard reads local Dexie standings |
| Supabase configured | Local-first write → sync queue → Supabase + Realtime leaderboard |
| `NEXT_PUBLIC_DEMO_MODE=true` | Legacy simulated arena cast (explicit opt-in only) |

See [SETUP.md](./SETUP.md) and [DEPLOYMENT.md](./DEPLOYMENT.md).
