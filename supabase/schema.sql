-- Terminus schema. Run once in the Supabase SQL editor.
-- Every table is private per user through row-level security.

create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  weekly_budget int not null default 4 check (weekly_budget between 1 and 50),
  created_at timestamptz not null default now()
);

-- One row per A2Z item the user has touched.
-- status: done (solved, in review cycle), known (ticked "I know this"), skipped.
-- stage: 1..3 = waiting for the 3/7/21-day review, 4 = graduated.
create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_key text not null check (char_length(item_key) <= 120),
  status text not null check (status in ('done', 'known', 'skipped')),
  stage int not null default 0 check (stage between 0 and 4),
  next_review date,
  done_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_key)
);

create index if not exists progress_review_idx
  on public.progress (user_id, next_review);

-- One row per solve or review session, with the user's note.
create table if not exists public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  item_key text not null check (char_length(item_key) <= 120),
  kind text not null check (kind in ('new', 'review')),
  result text not null check (result in ('alone', 'hint', 'solution', 'clean', 'struggled')),
  minutes int check (minutes between 0 and 1440),
  pattern text check (char_length(pattern) <= 200),
  key_idea text check (char_length(key_idea) <= 2000),
  mistake text check (char_length(mistake) <= 2000),
  complexity text check (char_length(complexity) <= 200),
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_idx
  on public.attempts (user_id, created_at);

alter table public.settings enable row level security;
alter table public.progress enable row level security;
alter table public.attempts enable row level security;

drop policy if exists "own settings" on public.settings;
create policy "own settings" on public.settings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "own progress" on public.progress;
create policy "own progress" on public.progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "own attempts" on public.attempts;
create policy "own attempts" on public.attempts
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Anonymous visitors get nothing.
revoke all on public.settings, public.progress, public.attempts from anon;

-- Signed-in users reach the tables only through the policies above.
grant select, insert, update, delete
  on public.settings, public.progress, public.attempts to authenticated;
