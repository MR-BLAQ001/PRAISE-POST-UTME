-- ============================================================================
-- PRAISE POST UTME — seed data
-- ============================================================================
-- Run after supabase/schema.sql.
--
-- 1. Load the 800-question bank:
--      npm run export:questions
--    then run supabase/questions.seed.sql in the SQL editor.
--
-- 2. Create your administrator account through Supabase Auth (or the app),
--    then promote it:
--      select public.promote_admin('you@example.com');
--
-- The app never seeds fake students, results, leaderboard scores or reports.
-- ============================================================================

insert into public.platform_settings (id, pass_mark, site_notice, maintenance)
values (
  true,
  50,
  'Welcome to PRAISE POST UTME. Your next breakthrough starts with one practice session.',
  false
)
on conflict (id) do update set
  pass_mark = excluded.pass_mark,
  site_notice = excluded.site_notice,
  maintenance = excluded.maintenance;
