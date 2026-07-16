-- Sprint 21: staff quick-scan contacts
-- Distinguishes quiz participants from badge-only contact captures.

alter table public.participants
  add column if not exists source text not null default 'quiz';

comment on column public.participants.source is
  'Origin of the row: quiz (challenge registration) or quick_scan (staff badge capture).';

create index if not exists participants_source_created_at_idx
  on public.participants (source, created_at desc);
