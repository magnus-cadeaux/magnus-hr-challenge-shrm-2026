# Magnus HR Challenge — Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (free tier is fine for exhibition prep)
- Optional: Supabase CLI for local migrations

## 1. Install

```bash
npm install
cp .env.example .env.local
```

## 2. Configure environment

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # server only
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_EVENT_NAME=SHRM Hyderabad 2026
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in client code or `NEXT_PUBLIC_*` vars.

## 3. Apply database migrations

In the Supabase SQL editor (or CLI):

1. Run `supabase/migrations/20260715000000_init_schema.sql`
2. Run `supabase/migrations/20260715000001_rls_policies.sql`
3. Run `supabase/migrations/20260715000002_seed_inventory.sql`

Or with CLI:

```bash
supabase db push
```

## 4. Enable Realtime

Migrations add tables to `supabase_realtime`. Confirm in Supabase Dashboard → Database → Replication that these are enabled:

- leaderboard
- reward_inventory
- reward_claims
- participants
- sales_profiles
- event_settings

## 5. Local development

```bash
npm run dev
```

Open http://localhost:3000

Hidden staff routes:

- `/admin` — Control Center
- `/sales` — Sales Companion

## 6. Verify health

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Offline / multi-iPad notes

- Participant actions write to sessionStorage + Dexie, then enqueue a sync job.
- When online and Supabase is configured, the sync runtime flushes the queue with retry + LWW conflict handling.
- Both iPads share inventory, leaderboard, participants, and claims through Supabase + Realtime.
