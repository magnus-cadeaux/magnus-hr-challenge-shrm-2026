-- Magnus HR Challenge — production schema
-- SHRM Hyderabad 2026
-- Sprint 11

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.app_role as enum ('anonymous', 'staff', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.conversation_status as enum ('pending', 'in_progress', 'complete');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.gift_tier as enum ('A', 'B', 'C', 'premium_upgrade');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.sync_status as enum ('pending', 'syncing', 'synced', 'failed', 'conflict');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Companies
-- ---------------------------------------------------------------------------

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  normalized_name text generated always as (lower(trim(name))) stored,
  participant_count integer not null default 0,
  average_score numeric(6,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_name_unique unique (normalized_name)
);

-- ---------------------------------------------------------------------------
-- Participants
-- ---------------------------------------------------------------------------

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  local_session_id text,
  full_name text not null,
  email text,
  phone text,
  company_id uuid references public.companies (id) on delete set null,
  company_name text,
  device_id text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists participants_company_id_idx on public.participants (company_id);
create index if not exists participants_created_at_idx on public.participants (created_at desc);
create index if not exists participants_local_session_id_idx on public.participants (local_session_id);

-- ---------------------------------------------------------------------------
-- Challenge sessions + answers
-- ---------------------------------------------------------------------------

create table if not exists public.challenge_sessions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants (id) on delete cascade,
  local_session_id text not null,
  status text not null default 'in_progress',
  question_ids jsonb not null default '[]'::jsonb,
  dimension_scores jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  elapsed_ms integer,
  device_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint challenge_sessions_local_unique unique (local_session_id)
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.challenge_sessions (id) on delete cascade,
  question_id text not null,
  option_ids jsonb not null default '[]'::jsonb,
  impacts jsonb not null default '{}'::jsonb,
  answered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint answers_session_question_unique unique (session_id, question_id)
);

create index if not exists answers_session_id_idx on public.answers (session_id);

-- ---------------------------------------------------------------------------
-- Signature profiles + achievements
-- ---------------------------------------------------------------------------

create table if not exists public.signature_profiles (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants (id) on delete cascade,
  session_id uuid references public.challenge_sessions (id) on delete set null,
  local_session_id text,
  primary_signature_id text not null,
  secondary_signature_id text not null,
  display_name text,
  organization text,
  scores jsonb not null default '{}'::jsonb,
  normalized_scores jsonb not null default '{}'::jsonb,
  insight text,
  recommendations jsonb not null default '[]'::jsonb,
  percentile integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists signature_profiles_primary_idx
  on public.signature_profiles (primary_signature_id);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants (id) on delete cascade,
  signature_profile_id uuid references public.signature_profiles (id) on delete cascade,
  achievement_key text not null,
  title text not null,
  description text,
  dimension text,
  awarded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists achievements_participant_id_idx on public.achievements (participant_id);

-- ---------------------------------------------------------------------------
-- Rewards
-- ---------------------------------------------------------------------------

create table if not exists public.reward_inventory (
  id uuid primary key default gen_random_uuid(),
  gift_key text not null unique,
  name text not null,
  description text,
  image_src text,
  tier public.gift_tier not null,
  stock integer not null default 0 check (stock >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  distributed integer not null default 0 check (distributed >= 0),
  low_stock_threshold integer not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants (id) on delete set null,
  local_session_id text,
  inventory_id uuid references public.reward_inventory (id) on delete set null,
  gift_key text not null,
  gift_name text not null,
  tier public.gift_tier not null,
  collection_code text not null unique,
  upgraded boolean not null default false,
  base_gift_key text,
  assigned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reward_claims (
  id uuid primary key default gen_random_uuid(),
  reward_id uuid not null references public.rewards (id) on delete cascade,
  claimed_by text,
  claimed_at timestamptz not null default now(),
  device_id text,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leaderboard (materialized standings for multi-iPad)
-- ---------------------------------------------------------------------------

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants (id) on delete cascade,
  display_name text not null,
  company_name text,
  score numeric(6,2) not null default 0,
  signature_id text,
  signature_name text,
  rank integer,
  event_day date not null default (timezone('utc', now()))::date,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint leaderboard_participant_day_unique unique (participant_id, event_day)
);

create index if not exists leaderboard_event_day_score_idx
  on public.leaderboard (event_day, score desc);

-- ---------------------------------------------------------------------------
-- Sales
-- ---------------------------------------------------------------------------

create table if not exists public.sales_profiles (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.participants (id) on delete cascade,
  local_session_id text,
  lead_score integer not null default 0,
  decision_confidence text,
  organisation_maturity text,
  profile jsonb not null default '{}'::jsonb,
  conversation_status public.conversation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales_notes (
  id uuid primary key default gen_random_uuid(),
  sales_profile_id uuid references public.sales_profiles (id) on delete cascade,
  participant_id uuid references public.participants (id) on delete cascade,
  local_session_id text,
  notes text not null default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Event settings (shared across iPads)
-- ---------------------------------------------------------------------------

create table if not exists public.event_settings (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique default 'current',
  event_name text not null default 'SHRM Hyderabad 2026',
  brand_name text not null default 'Magnus HR Challenge',
  question_bank_version text not null default 'v1',
  lucky_upgrade_probability numeric(5,4) not null default 0.0300,
  theme text not null default 'dark_navy',
  reward_inventory_config jsonb not null default '[]'::jsonb,
  extras jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

insert into public.event_settings (event_key)
values ('current')
on conflict (event_key) do nothing;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'companies',
    'participants',
    'challenge_sessions',
    'signature_profiles',
    'reward_inventory',
    'rewards',
    'leaderboard',
    'sales_profiles',
    'sales_notes',
    'event_settings'
  ]
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();',
      t,
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Role helper (JWT app_metadata.role = admin | staff)
-- ---------------------------------------------------------------------------

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() -> 'app_metadata' ->> 'role', ''),
    nullif(auth.jwt() -> 'user_metadata' ->> 'role', ''),
    'anonymous'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
as $$
  select public.current_app_role() in ('staff', 'admin');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'admin';
$$;
