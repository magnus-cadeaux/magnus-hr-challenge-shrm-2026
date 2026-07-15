# Magnus HR Challenge

Premium exhibition experience for senior HR leaders — **SHRM Hyderabad 2026**.

## Product flow

`/` → Register → Arena → Challenge → Analysis → Signature → Reward → Leaderboard

Staff-only (hidden):

- `/sales` — Sales Companion
- `/admin` — Control Center

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Framer Motion · TanStack Query · React Hook Form · Zod
- Dexie (offline-first) · Supabase (shared multi-iPad backend)
- Vercel-ready

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

See [docs/SETUP.md](docs/SETUP.md) for Supabase migrations and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Turbopack server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run test` | Smoke tests (Vitest) |
| `npm run prepare:check` | typecheck + lint + format |

## Production architecture (Sprint 11)

1. **Local-first writes** — sessionStorage + Dexie
2. **Sync queue** — automatic retry, LWW conflict resolution
3. **Supabase** — shared participants, inventory, leaderboard, sales, settings
4. **Realtime** — multi-iPad live updates
5. **Kiosk mode** — 90s idle → `/` + clear participant session
6. **CSV exports** — participants, leads, inventory, challenge sessions

The app runs fully without Supabase (local demo mode). Connect env vars + migrations for production sync.

## Security notes

- Only `NEXT_PUBLIC_*` values are shipped to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (`services/supabase/admin.ts`).
- RLS policies prepare anonymous booth devices + future staff/admin JWT roles.
- Middleware assigns request IDs (rate-limit hook points prepared).

## License

Proprietary — Magnus.
