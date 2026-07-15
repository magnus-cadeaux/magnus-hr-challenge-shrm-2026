# Magnus HR Challenge — Deployment Guide (Vercel)

## Overview

Deploy the Next.js 15 App Router project to Vercel with Supabase as the shared backend for multi-iPad operation.

## 1. Create Vercel project

1. Import the Git repository into Vercel.
2. Framework preset: **Next.js**
3. Root directory: repository root
4. Build command: `npm run build`
5. Output: default Next.js output

`vercel.json` sets Mumbai (`bom1`) as the preferred region for Hyderabad latency.

## 2. Environment variables

In Vercel → Project → Settings → Environment Variables:

| Name | Environment | Notes |
|------|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production / Preview | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production / Preview | Anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only | Server-only; never expose |
| `NEXT_PUBLIC_APP_URL` | Production | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | Production | Magnus HR Challenge |
| `NEXT_PUBLIC_EVENT_NAME` | Production | SHRM Hyderabad 2026 |

Redeploy after changing env vars.

## 3. Database

Apply migrations from `supabase/migrations/` to the production Supabase project before going live.

Confirm RLS policies are active (anonymous booth writes + staff/admin roles).

## 4. iPad kiosk setup

1. Open the production URL in Safari.
2. Add to Home Screen for fullscreen feel.
3. Disable Auto-Lock / use Guided Access for the booth.
4. Staff bookmark `/admin` and `/sales` privately (not linked in participant nav).

Kiosk idle protection returns to `/` after 90 seconds of inactivity on participant flows and clears the local participant session (analytics remain).

## 5. Smoke checklist

- [ ] Entry `/` loads
- [ ] Registration → challenge → analysis → signature → reward completes offline
- [ ] `/leaderboard` animates with mock or live data
- [ ] `/sales` reads local session intelligence
- [ ] `/admin` KPIs + inventory visible
- [ ] Toggle airplane mode → offline banner → resume → sync proceeds when Supabase configured
- [ ] CSV exports from Admin Quick Actions

## 6. Rollback

Vercel Instant Rollback to the previous production deployment. Database migrations are additive; avoid destructive SQL on event days.
