-- Terminus migration 002: proper reviews, notes, partner view, goal date, email.
-- Run once in the Supabase SQL editor, after schema.sql. Safe to run again.

-- ---------- Settings: goal date, name, time zone, email choices ----------

alter table public.settings
  add column if not exists finish_by date,
  add column if not exists display_name text check (char_length(display_name) <= 80),
  add column if not exists timezone text not null default 'Asia/Kolkata' check (char_length(timezone) <= 64),
  add column if not exists email_morning boolean not null default true,
  add column if not exists email_evening boolean not null default true,
  add column if not exists email_weekly boolean not null default true;

-- ---------- Attempts: "forgot completely" and a long approach field ----------

alter table public.attempts drop constraint if exists attempts_result_check;
alter table public.attempts add constraint attempts_result_check
  check (result in ('alone', 'hint', 'solution', 'clean', 'struggled', 'forgot'));

alter table public.attempts
  add column if not exists approach text check (char_length(approach) <= 8000);

-- ---------- Partners ----------

-- One row per direction: (me, partner) and (partner, me).
create table if not exists public.partners (
  user_id uuid not null references auth.users (id) on delete cascade,
  partner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, partner_id),
  check (user_id <> partner_id)
);

alter table public.partners enable row level security;

drop policy if exists "see own links" on public.partners;
create policy "see own links" on public.partners
  for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.partners from anon;
grant select on public.partners to authenticated;

-- A short code that one person shares with the other. Valid for 7 days.
create table if not exists public.invites (
  code text primary key check (code ~ '^[A-Z2-9]{6}$'),
  owner uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.invites enable row level security;

drop policy if exists "own invites" on public.invites;
create policy "own invites" on public.invites
  for all to authenticated
  using ((select auth.uid()) = owner)
  with check ((select auth.uid()) = owner);

revoke all on public.invites from anon;
grant select, insert, delete on public.invites to authenticated;

-- Accepts a code: links both people both ways and uses up the code.
create or replace function public.accept_invite(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  them uuid;
  c text := upper(trim(p_code));
begin
  if me is null then
    raise exception 'Not signed in';
  end if;
  select owner into them from public.invites
    where code = c and created_at > now() - interval '7 days';
  if them is null then
    raise exception 'That code is wrong or has expired';
  end if;
  if them = me then
    raise exception 'That is your own code. Send it to your partner.';
  end if;
  insert into public.partners (user_id, partner_id)
    values (me, them), (them, me)
    on conflict do nothing;
  delete from public.invites where code = c;
  return them;
end;
$$;

-- Removes the link in both directions.
create or replace function public.remove_partner(p_partner uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'Not signed in';
  end if;
  delete from public.partners
    where (user_id = me and partner_id = p_partner)
       or (user_id = p_partner and partner_id = me);
end;
$$;

revoke all on function public.accept_invite(text) from public, anon;
revoke all on function public.remove_partner(uuid) from public, anon;
grant execute on function public.accept_invite(text) to authenticated;
grant execute on function public.remove_partner(uuid) to authenticated;

-- Partners may READ each other's settings, progress and attempts (notes too).
-- They can never write them: these are select-only policies.
drop policy if exists "partner reads settings" on public.settings;
create policy "partner reads settings" on public.settings
  for select to authenticated
  using (exists (
    select 1 from public.partners p
    where p.user_id = (select auth.uid()) and p.partner_id = settings.user_id
  ));

drop policy if exists "partner reads progress" on public.progress;
create policy "partner reads progress" on public.progress
  for select to authenticated
  using (exists (
    select 1 from public.partners p
    where p.user_id = (select auth.uid()) and p.partner_id = progress.user_id
  ));

drop policy if exists "partner reads attempts" on public.attempts;
create policy "partner reads attempts" on public.attempts
  for select to authenticated
  using (exists (
    select 1 from public.partners p
    where p.user_id = (select auth.uid()) and p.partner_id = attempts.user_id
  ));

create index if not exists partners_partner_idx on public.partners (partner_id);

-- ---------- Email ----------

-- Which reminder went out on which day, so none is sent twice.
-- Only the email function (service role) touches it.
create table if not exists public.email_log (
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('morning', 'evening', 'weekly')),
  day date not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, kind, day)
);

alter table public.email_log enable row level security;
revoke all on public.email_log from anon, authenticated;

-- A random secret that proves a call to the email function came from the
-- schedule below. It lives in Vault; nobody needs to copy it anywhere.
create extension if not exists pg_net;
create extension if not exists pg_cron;
create extension if not exists pgcrypto with schema extensions;

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'terminus_cron_secret') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(24), 'hex'), 'terminus_cron_secret');
  end if;
end;
$$;

-- The email function reads the secret through this. Only the service role
-- may call it.
create or replace function public.terminus_cron_secret()
returns text
language sql
security definer
set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'terminus_cron_secret'
$$;

revoke all on function public.terminus_cron_secret() from public, anon, authenticated;
grant execute on function public.terminus_cron_secret() to service_role;

-- Every hour at :05. The function decides who is due an email in their own
-- time zone (08:00 morning, 21:00 evening, Sunday 19:00 weekly).
select cron.unschedule('terminus-email')
  where exists (select 1 from cron.job where jobname = 'terminus-email');

select cron.schedule(
  'terminus-email',
  '5 * * * *',
  $cron$
  select net.http_post(
    url := 'https://togfwomhavguoxbwerem.supabase.co/functions/v1/daily-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'terminus_cron_secret')
    ),
    body := '{}'::jsonb
  );
  $cron$
);
