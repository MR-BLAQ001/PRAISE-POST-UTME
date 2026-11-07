-- ============================================================================
-- PRAISE POST UTME — production Supabase schema
-- ============================================================================
-- Run this file in the Supabase SQL editor (or as a migration) before enabling
-- Supabase in .env.local. The browser build ships with a complete local demo
-- store, so this schema is optional until you are ready for hosted accounts.
--
-- Security model:
--   * Students can read and write only their own private records.
--   * Questions are readable by signed-in users; only admins can change them.
--   * Leaderboard aggregation happens in a SECURITY DEFINER function that
--     returns only public fields. Private rows are never exposed in bulk.
--   * The service-role key must stay server-side. Never ship it to the browser.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (email stays in auth.users; it is never copied here)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  display_name text not null check (char_length(display_name) between 1 and 60),
  role text not null default 'student' check (role in ('student', 'admin')),
  school text not null default '',
  university_id text,
  preferred_subjects text[] not null default '{}',
  avatar text,
  bio text not null default '',
  leaderboard_opt_out boolean not null default false,
  is_guest boolean not null default false,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_leaderboard_idx
  on public.profiles (leaderboard_opt_out, is_guest, role);

-- Prevent ordinary students from promoting themselves or changing flags that
-- affect ranking. Administrators may change any profile.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role then
    raise exception 'Only administrators can change a role.';
  end if;
  if new.is_guest is distinct from old.is_guest then
    raise exception 'Only administrators can change guest status.';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'created_at cannot be changed.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_fields on public.profiles;
create trigger profiles_protect_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- Create a profile automatically when a user signs up through Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix integer := 0;
  raw_subjects jsonb;
begin
  base_username := regexp_replace(
    lower(coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))),
    '[^a-z0-9_]',
    '',
    'g'
  );
  if char_length(base_username) < 3 then
    base_username := 'student';
  end if;
  base_username := left(base_username, 16);
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := left(base_username, 20 - char_length(suffix::text)) || suffix::text;
  end loop;

  raw_subjects := new.raw_user_meta_data -> 'preferred_subjects';

  insert into public.profiles (
    id, username, display_name, school, preferred_subjects, avatar
  ) values (
    new.id,
    final_username,
    left(coalesce(new.raw_user_meta_data ->> 'display_name', final_username), 60),
    coalesce(new.raw_user_meta_data ->> 'school', ''),
    coalesce(
      array(select jsonb_array_elements_text(raw_subjects)),
      '{}'::text[]
    ),
    new.raw_user_meta_data ->> 'avatar'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Questions
-- ---------------------------------------------------------------------------
create table if not exists public.questions (
  id text primary key,
  subject text not null,
  topic text not null,
  difficulty text not null default 'medium'
    check (difficulty in ('easy', 'medium', 'hard')),
  text text not null check (char_length(text) >= 10),
  options jsonb not null
    check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  correct_index smallint not null check (correct_index between 0 and 3),
  explanation text not null check (char_length(explanation) >= 10),
  source text not null default 'practice'
    check (source in ('practice', 'custom')),
  is_custom boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists questions_subject_topic_idx
  on public.questions (subject, topic);
create index if not exists questions_difficulty_idx on public.questions (difficulty);

-- ---------------------------------------------------------------------------
-- Results and practice activity
-- ---------------------------------------------------------------------------
create table if not exists public.results (
  id text primary key,
  attempt_id text not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  mode text not null,
  title text not null,
  subjects text[] not null default '{}',
  answers jsonb not null,
  total integer not null check (total >= 0),
  correct integer not null check (correct >= 0),
  incorrect integer not null check (incorrect >= 0),
  unanswered integer not null check (unanswered >= 0),
  percentage integer not null check (percentage between 0 and 100),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  points integer not null default 0 check (points >= 0),
  passed boolean not null default false,
  validation text not null default 'server'
    check (validation in ('server', 'client-demo')),
  unique (user_id, attempt_id)
);

create index if not exists results_user_completed_idx
  on public.results (user_id, completed_at desc);
create index if not exists results_mode_completed_idx
  on public.results (mode, completed_at desc);

create table if not exists public.practice_attempts (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id text not null references public.questions (id) on delete cascade,
  subject text not null,
  topic text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  selected_index smallint check (selected_index between 0 and 3),
  correct boolean not null default false,
  answered_at timestamptz not null default now(),
  mode text not null
);

create index if not exists practice_user_idx
  on public.practice_attempts (user_id, answered_at desc);
create index if not exists practice_subject_idx
  on public.practice_attempts (user_id, subject);

-- ---------------------------------------------------------------------------
-- Study data
-- ---------------------------------------------------------------------------
create table if not exists public.bookmarks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id text not null references public.questions (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.notes (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id text references public.questions (id) on delete set null,
  title text not null check (char_length(title) between 1 and 120),
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_idx on public.notes (user_id, updated_at desc);

drop trigger if exists notes_touch_updated_at on public.notes;
create trigger notes_touch_updated_at
  before update on public.notes
  for each row execute function public.touch_updated_at();

create table if not exists public.question_reports (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id text not null,
  subject text not null,
  reason text not null,
  detail text not null default '',
  status text not null default 'open'
    check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists reports_status_idx
  on public.question_reports (status, created_at desc);

create table if not exists public.notifications (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null default 'system'
    check (type in ('result', 'achievement', 'leaderboard', 'daily', 'report', 'system')),
  title text not null,
  message text not null default '',
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

create table if not exists public.study_plans (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  exam_date date,
  target_university_id text,
  weekly_goal integer not null default 5 check (weekly_goal between 1 and 50),
  updated_at timestamptz not null default now()
);

drop trigger if exists study_plans_touch_updated_at on public.study_plans;
create trigger study_plans_touch_updated_at
  before update on public.study_plans
  for each row execute function public.touch_updated_at();

create table if not exists public.study_tasks (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  subject text not null,
  due_date date not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists study_tasks_user_idx
  on public.study_tasks (user_id, due_date);

create table if not exists public.daily_challenges (
  user_id uuid not null references public.profiles (id) on delete cascade,
  challenge_date date not null,
  completed boolean not null default false,
  score integer check (score between 0 and 100),
  result_id text references public.results (id) on delete set null,
  primary key (user_id, challenge_date)
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.activity_events (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('exam', 'practice', 'account', 'admin', 'question')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists activity_created_idx
  on public.activity_events (created_at desc);

-- ---------------------------------------------------------------------------
-- Platform settings (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_settings (
  id boolean primary key default true check (id),
  pass_mark integer not null default 50 check (pass_mark between 0 and 100),
  site_notice text not null default ''
    check (char_length(site_notice) <= 280),
  maintenance boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (id)
values (true)
on conflict (id) do nothing;

drop trigger if exists platform_settings_touch_updated_at on public.platform_settings;
create trigger platform_settings_touch_updated_at
  before update on public.platform_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.results enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notes enable row level security;
alter table public.question_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.study_plans enable row level security;
alter table public.study_tasks enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.user_achievements enable row level security;
alter table public.activity_events enable row level security;
alter table public.platform_settings enable row level security;

-- Profiles -----------------------------------------------------------------
drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert to authenticated
  with check (id = auth.uid() and role = 'student' and is_guest = false);

drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles delete admin" on public.profiles;
create policy "profiles delete admin"
  on public.profiles for delete to authenticated
  using (public.is_admin());

-- Questions ----------------------------------------------------------------
drop policy if exists "questions read authenticated" on public.questions;
create policy "questions read authenticated"
  on public.questions for select to authenticated
  using (true);

drop policy if exists "questions insert admin" on public.questions;
create policy "questions insert admin"
  on public.questions for insert to authenticated
  with check (public.is_admin());

drop policy if exists "questions update admin" on public.questions;
create policy "questions update admin"
  on public.questions for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "questions delete admin" on public.questions;
create policy "questions delete admin"
  on public.questions for delete to authenticated
  using (public.is_admin());

-- Results ------------------------------------------------------------------
drop policy if exists "results read own or admin" on public.results;
create policy "results read own or admin"
  on public.results for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "results insert own" on public.results;
create policy "results insert own"
  on public.results for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "results update own or admin" on public.results;
create policy "results update own or admin"
  on public.results for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "results delete own or admin" on public.results;
create policy "results delete own or admin"
  on public.results for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Practice -----------------------------------------------------------------
drop policy if exists "practice read own or admin" on public.practice_attempts;
create policy "practice read own or admin"
  on public.practice_attempts for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "practice insert own" on public.practice_attempts;
create policy "practice insert own"
  on public.practice_attempts for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "practice delete own or admin" on public.practice_attempts;
create policy "practice delete own or admin"
  on public.practice_attempts for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Bookmarks ----------------------------------------------------------------
drop policy if exists "bookmarks own or admin" on public.bookmarks;
create policy "bookmarks own or admin"
  on public.bookmarks for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Notes --------------------------------------------------------------------
drop policy if exists "notes own or admin" on public.notes;
create policy "notes own or admin"
  on public.notes for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Reports ------------------------------------------------------------------
drop policy if exists "reports read own or admin" on public.question_reports;
create policy "reports read own or admin"
  on public.question_reports for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "reports insert own" on public.question_reports;
create policy "reports insert own"
  on public.question_reports for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "reports update admin" on public.question_reports;
create policy "reports update admin"
  on public.question_reports for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reports delete admin" on public.question_reports;
create policy "reports delete admin"
  on public.question_reports for delete to authenticated
  using (public.is_admin());

-- Notifications ------------------------------------------------------------
drop policy if exists "notifications read own or admin" on public.notifications;
create policy "notifications read own or admin"
  on public.notifications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications update own or admin" on public.notifications;
create policy "notifications update own or admin"
  on public.notifications for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications delete own or admin" on public.notifications;
create policy "notifications delete own or admin"
  on public.notifications for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "notifications insert admin" on public.notifications;
create policy "notifications insert admin"
  on public.notifications for insert to authenticated
  with check (public.is_admin());

-- Plans and tasks ----------------------------------------------------------
drop policy if exists "plans own or admin" on public.study_plans;
create policy "plans own or admin"
  on public.study_plans for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "tasks own or admin" on public.study_tasks;
create policy "tasks own or admin"
  on public.study_tasks for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Daily challenges ---------------------------------------------------------
drop policy if exists "challenges own or admin" on public.daily_challenges;
create policy "challenges own or admin"
  on public.daily_challenges for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Achievements -------------------------------------------------------------
drop policy if exists "achievements read own or admin" on public.user_achievements;
create policy "achievements read own or admin"
  on public.user_achievements for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "achievements insert own or admin" on public.user_achievements;
create policy "achievements insert own or admin"
  on public.user_achievements for insert to authenticated
  with check (user_id = auth.uid() or public.is_admin());

-- Activity -----------------------------------------------------------------
drop policy if exists "activity read own or admin" on public.activity_events;
create policy "activity read own or admin"
  on public.activity_events for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "activity insert own or admin" on public.activity_events;
create policy "activity insert own or admin"
  on public.activity_events for insert to authenticated
  with check (user_id = auth.uid() or public.is_admin());

-- Settings -----------------------------------------------------------------
drop policy if exists "settings read authenticated" on public.platform_settings;
create policy "settings read authenticated"
  on public.platform_settings for select to authenticated
  using (true);

drop policy if exists "settings update admin" on public.platform_settings;
create policy "settings update admin"
  on public.platform_settings for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Leaderboard function (aggregates only public fields)
-- ---------------------------------------------------------------------------
create or replace function public.get_leaderboard(
  p_period text default 'all-time',
  p_subject text default null,
  p_limit integer default 50
)
returns table (
  rank integer,
  user_id uuid,
  username text,
  display_name text,
  avatar text,
  points integer,
  average_score integer,
  exams integer,
  accuracy integer
)
language sql
stable
security definer
set search_path = public
as $$
  with bounds as (
    select case
      when p_period = 'weekly' then date_trunc('week', now())
      when p_period = 'monthly' then date_trunc('month', now())
      else null
    end as start_at
  ),
  ranked as (
    select r.*
    from public.results r
    cross join bounds b
    where r.mode in ('full-cbt', 'custom')
      and (b.start_at is null or r.completed_at >= b.start_at)
  ),
  overall_stats as (
    select
      r.user_id,
      coalesce(sum(r.correct), 0)::integer as correct,
      coalesce(sum(r.total), 0)::integer as total,
      coalesce(sum(r.points), 0)::integer as points,
      count(*)::integer as exams
    from ranked r
    group by r.user_id
  ),
  subject_stats as (
    select
      r.user_id,
      count(*) filter (where (answer ->> 'isCorrect')::boolean)::integer as correct,
      count(*)::integer as total,
      (count(*) filter (where (answer ->> 'isCorrect')::boolean) * 10)::integer as points,
      count(distinct r.id)::integer as exams
    from ranked r
    cross join lateral jsonb_array_elements(r.answers) as answer
    where p_subject is not null
      and answer ->> 'subject' = p_subject
    group by r.user_id
  ),
  stats as (
    select * from overall_stats where p_subject is null
    union all
    select * from subject_stats where p_subject is not null
  ),
  scored as (
    select
      s.user_id,
      p.username,
      p.display_name,
      p.avatar,
      s.points,
      case when s.total = 0 then 0
           else round(100.0 * s.correct / s.total)::integer end as average_score,
      s.exams,
      case when s.total = 0 then 0
           else round(100.0 * s.correct / s.total)::integer end as accuracy
    from stats s
    join public.profiles p on p.id = s.user_id
    where p.role = 'student'
      and p.is_guest = false
      and p.leaderboard_opt_out = false
      and s.total > 0
  )
  select
    row_number() over (
      order by average_score desc, points desc, exams desc, username asc
    )::integer as rank,
    user_id,
    username,
    display_name,
    avatar,
    points,
    average_score,
    exams,
    accuracy
  from scored
  order by 1
  limit greatest(1, least(coalesce(p_limit, 50), 200));
$$;

revoke all on function public.get_leaderboard(text, text, integer) from public;
grant execute on function public.get_leaderboard(text, text, integer) to authenticated;

-- Promote an existing Auth account to administrator.
-- Called manually from the SQL editor after the account has signed up.
create or replace function public.promote_admin(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  select id into target from auth.users where lower(email) = lower(p_email);
  if target is null then
    raise exception 'No Auth user exists for %', p_email;
  end if;
  update public.profiles set role = 'admin' where id = target;
end;
$$;

revoke all on function public.promote_admin(text) from public;
revoke all on function public.promote_admin(text) from anon;
revoke all on function public.promote_admin(text) from authenticated;
grant execute on function public.promote_admin(text) to service_role;

-- ---------------------------------------------------------------------------
-- Avatar storage (optional)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars own upload" on storage.objects;
create policy "avatars own upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars own update" on storage.objects;
create policy "avatars own update"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars own delete" on storage.objects;
create policy "avatars own delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
