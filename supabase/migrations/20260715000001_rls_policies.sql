-- Row Level Security policies
-- Anonymous booth devices insert participant flow data.
-- Staff/admin can read/write operational tables.
-- Future authenticated staff use JWT app_metadata.role.

alter table public.companies enable row level security;
alter table public.participants enable row level security;
alter table public.challenge_sessions enable row level security;
alter table public.answers enable row level security;
alter table public.signature_profiles enable row level security;
alter table public.achievements enable row level security;
alter table public.reward_inventory enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_claims enable row level security;
alter table public.leaderboard enable row level security;
alter table public.sales_profiles enable row level security;
alter table public.sales_notes enable row level security;
alter table public.event_settings enable row level security;

-- Companies
drop policy if exists companies_public_read on public.companies;
create policy companies_public_read on public.companies
  for select to anon, authenticated
  using (true);

drop policy if exists companies_anon_insert on public.companies;
create policy companies_anon_insert on public.companies
  for insert to anon, authenticated
  with check (true);

drop policy if exists companies_staff_write on public.companies;
create policy companies_staff_write on public.companies
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Participants
drop policy if exists participants_public_read on public.participants;
create policy participants_public_read on public.participants
  for select to anon, authenticated
  using (true);

drop policy if exists participants_anon_insert on public.participants;
create policy participants_anon_insert on public.participants
  for insert to anon, authenticated
  with check (true);

drop policy if exists participants_anon_update on public.participants;
create policy participants_anon_update on public.participants
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists participants_staff_all on public.participants;
create policy participants_staff_all on public.participants
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Challenge sessions
drop policy if exists challenge_sessions_public_read on public.challenge_sessions;
create policy challenge_sessions_public_read on public.challenge_sessions
  for select to anon, authenticated
  using (true);

drop policy if exists challenge_sessions_anon_write on public.challenge_sessions;
create policy challenge_sessions_anon_write on public.challenge_sessions
  for insert to anon, authenticated
  with check (true);

drop policy if exists challenge_sessions_anon_update on public.challenge_sessions;
create policy challenge_sessions_anon_update on public.challenge_sessions
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists challenge_sessions_staff_all on public.challenge_sessions;
create policy challenge_sessions_staff_all on public.challenge_sessions
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Answers
drop policy if exists answers_public_read on public.answers;
create policy answers_public_read on public.answers
  for select to anon, authenticated
  using (true);

drop policy if exists answers_anon_insert on public.answers;
create policy answers_anon_insert on public.answers
  for insert to anon, authenticated
  with check (true);

drop policy if exists answers_staff_all on public.answers;
create policy answers_staff_all on public.answers
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Signature profiles
drop policy if exists signature_profiles_public_read on public.signature_profiles;
create policy signature_profiles_public_read on public.signature_profiles
  for select to anon, authenticated
  using (true);

drop policy if exists signature_profiles_anon_write on public.signature_profiles;
create policy signature_profiles_anon_write on public.signature_profiles
  for insert to anon, authenticated
  with check (true);

drop policy if exists signature_profiles_anon_update on public.signature_profiles;
create policy signature_profiles_anon_update on public.signature_profiles
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists signature_profiles_staff_all on public.signature_profiles;
create policy signature_profiles_staff_all on public.signature_profiles
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Achievements
drop policy if exists achievements_public_read on public.achievements;
create policy achievements_public_read on public.achievements
  for select to anon, authenticated
  using (true);

drop policy if exists achievements_anon_insert on public.achievements;
create policy achievements_anon_insert on public.achievements
  for insert to anon, authenticated
  with check (true);

drop policy if exists achievements_staff_all on public.achievements;
create policy achievements_staff_all on public.achievements
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Reward inventory (shared across iPads)
drop policy if exists reward_inventory_public_read on public.reward_inventory;
create policy reward_inventory_public_read on public.reward_inventory
  for select to anon, authenticated
  using (true);

drop policy if exists reward_inventory_staff_write on public.reward_inventory;
create policy reward_inventory_staff_write on public.reward_inventory
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Allow anon devices to reserve via controlled RPC later; interim update for booth sync
drop policy if exists reward_inventory_anon_update on public.reward_inventory;
create policy reward_inventory_anon_update on public.reward_inventory
  for update to anon, authenticated
  using (true)
  with check (true);

-- Rewards
drop policy if exists rewards_public_read on public.rewards;
create policy rewards_public_read on public.rewards
  for select to anon, authenticated
  using (true);

drop policy if exists rewards_anon_insert on public.rewards;
create policy rewards_anon_insert on public.rewards
  for insert to anon, authenticated
  with check (true);

drop policy if exists rewards_staff_all on public.rewards;
create policy rewards_staff_all on public.rewards
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Reward claims
drop policy if exists reward_claims_public_read on public.reward_claims;
create policy reward_claims_public_read on public.reward_claims
  for select to anon, authenticated
  using (true);

drop policy if exists reward_claims_anon_insert on public.reward_claims;
create policy reward_claims_anon_insert on public.reward_claims
  for insert to anon, authenticated
  with check (true);

drop policy if exists reward_claims_staff_all on public.reward_claims;
create policy reward_claims_staff_all on public.reward_claims
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Leaderboard
drop policy if exists leaderboard_public_read on public.leaderboard;
create policy leaderboard_public_read on public.leaderboard
  for select to anon, authenticated
  using (true);

drop policy if exists leaderboard_anon_upsert on public.leaderboard;
create policy leaderboard_anon_upsert on public.leaderboard
  for insert to anon, authenticated
  with check (true);

drop policy if exists leaderboard_anon_update on public.leaderboard;
create policy leaderboard_anon_update on public.leaderboard
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists leaderboard_staff_all on public.leaderboard;
create policy leaderboard_staff_all on public.leaderboard
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Sales profiles (staff-facing; anon write from same booth device after challenge)
drop policy if exists sales_profiles_staff_read on public.sales_profiles;
create policy sales_profiles_staff_read on public.sales_profiles
  for select to anon, authenticated
  using (true);

drop policy if exists sales_profiles_anon_write on public.sales_profiles;
create policy sales_profiles_anon_write on public.sales_profiles
  for insert to anon, authenticated
  with check (true);

drop policy if exists sales_profiles_anon_update on public.sales_profiles;
create policy sales_profiles_anon_update on public.sales_profiles
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists sales_profiles_staff_all on public.sales_profiles;
create policy sales_profiles_staff_all on public.sales_profiles
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Sales notes
drop policy if exists sales_notes_staff_read on public.sales_notes;
create policy sales_notes_staff_read on public.sales_notes
  for select to anon, authenticated
  using (true);

drop policy if exists sales_notes_anon_write on public.sales_notes;
create policy sales_notes_anon_write on public.sales_notes
  for insert to anon, authenticated
  with check (true);

drop policy if exists sales_notes_anon_update on public.sales_notes;
create policy sales_notes_anon_update on public.sales_notes
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists sales_notes_staff_all on public.sales_notes;
create policy sales_notes_staff_all on public.sales_notes
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Event settings
drop policy if exists event_settings_public_read on public.event_settings;
create policy event_settings_public_read on public.event_settings
  for select to anon, authenticated
  using (true);

drop policy if exists event_settings_admin_write on public.event_settings;
create policy event_settings_admin_write on public.event_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Realtime publication for multi-iPad surfaces (safe if already added)
do $$
begin
  alter publication supabase_realtime add table public.leaderboard;
exception when duplicate_object then null; when undefined_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.reward_inventory;
exception when duplicate_object then null; when undefined_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.reward_claims;
exception when duplicate_object then null; when undefined_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.participants;
exception when duplicate_object then null; when undefined_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.sales_profiles;
exception when duplicate_object then null; when undefined_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.event_settings;
exception when duplicate_object then null; when undefined_object then null;
end $$;
