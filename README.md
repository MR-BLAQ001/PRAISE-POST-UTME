# PRAISE POST UTME

A production-quality Nigerian POST-UTME CBT practice platform: realistic timed
examinations, 800 original explained questions across 16 subjects, honest
analytics, achievable milestones and admin tooling.

Built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**,
**Lucide**, **Recharts** and a demo-first local data layer. Supabase schema and
security policies are included as the production path.

> **Demo-first by design.** The full product works with no backend. Accounts,
> results, bookmarks, notes and admin changes are stored in this browser. No
> fake leaderboard scores, seeded students or hardcoded results exist anywhere.

---

## Contents

- [Quick start](#quick-start)
- [Demo accounts](#demo-accounts)
- [Features](#features)
- [Question bank](#question-bank)
- [Practice and exam modes](#practice-and-exam-modes)
- [Scoring and leaderboard integrity](#scoring-and-leaderboard-integrity)
- [Data and privacy](#data-and-privacy)
- [Production Supabase path](#production-supabase-path)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Known limitations](#known-limitations)
- [Contributing](#contributing)
- [License](#license)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables
are required for the demo experience.

For a production check:

```bash
npm run typecheck
npm run lint
npm test
npm run seed:check
npm run build
npm start
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `demo@praise.ng` | `Demo123!` |
| Administrator | `admin@praise.ng` | `Admin123!` |

You can also register a genuine local account, enter guest mode, or use the
one-click demo buttons on the login screen. Guest sessions are excluded from
leaderboards and from the admin student list.

> Demo passwords are hashed with SHA-256 and a per-user salt before storage. This
> is demonstration security, not production authentication. Use a throwaway
> password and enable Supabase Auth for a real deployment.

## Features

### Public site

- Premium dark navy/electric-blue design system with a light theme, responsive
  mobile/tablet/desktop layouts, gradients and subtle motion.
- Honest homepage driven by real bank statistics: subject coverage, question
  counts, modes, university guides and integrity rules.
- About/disclaimer, privacy and offline guidance pages.
- PWA manifest, installable icons, Open Graph image and offline shell.

### Accounts and personalisation

- Register, login, logout, guest mode, forgot/reset demo flow.
- Profile editing: display name, username, school, target university, preferred
  subjects, avatar and bio.
- Leaderboard opt-out that is respected immediately by the ranking engine.
- Theme preference persisted locally.

### Practice

- Nine ways to study: full CBT, custom examinations, quick practice, subject
  practice, topic practice, daily challenge, weakness training, random
  challenge and revision.
- Instant explanations in practice modes; exam-style review after a CBT.
- Timers, autosave and resume, question palette, mark-for-review, bookmarks and
  question reporting.
- Retake, print, CSV export and full answer review.

### Analytics

- Personal dashboard with score trend, subject accuracy, topic weaknesses,
  study streak, weekly report and a real question of the day.
- Result detail pages with subject/topic breakdown, filters, explanations,
  notes and retake actions.
- Achievements with genuine progress calculations — no unlocked badge is
  granted without the underlying activity.

### Leaderboards and universities

- Weekly, monthly and all-time boards, subject filters, personal rank card.
- Only completed full CBTs and custom examinations are ranked; practice never
  counts.
- Ten detailed Nigerian university guides with faculties, courses, subject
  combinations, requirements and official links. No invented cut-off marks.

### Administration

- Role-based access: admin routes are protected by the app shell and re-checked
  by every admin mutation.
- Question bank management: search, filter by subject/difficulty/source, add,
  edit, delete, inspect answers and export CSV.
- Seed edits are stored as overrides so the original bank can be restored.
- Bulk CSV/JSON import with validation, previews, duplicate detection, issue
  reporting and downloadable templates.
- Student management: activity, role changes, leaderboard preference, account
  deletion.
- Question report moderation with open/resolved/dismissed states.
- Platform settings: pass mark, site notice, maintenance mode, JSON backup and
  a guarded demo reset.

### Quality and integrity

- 800-question seed bank, 50 per subject, validated by a dedicated script.
- Unit tests for scoring, question selection, import parsing, leaderboards and
  utility functions.
- Server-side seed scoring through `/api/exam/submit`; local fallback for custom
  or edited questions, clearly labelled `client-demo`.
- No fabricated leaderboard entries, no placeholder questions, no non-functional
  buttons and no hidden analytics.

## Question bank

The bank contains **exactly 800 original questions**, fifty in each of the
sixteen subjects:

| Group | Subjects |
| --- | --- |
| Science | Mathematics, Physics, Chemistry, Biology, Agricultural Science |
| Arts & Humanities | English Language, Literature in English, Government, History, CRS, IRS |
| Commercial | Economics, Commerce, Accounting |
| General | Geography, Civic Education |

Every question has:

- a stable ID (for example `mth-001`) so saved history survives updates;
- a subject, topic, difficulty and four distinct options;
- a zero-based answer index and a written explanation;
- original practice content — no copied past-paper text.

Run the validator any time:

```bash
npm run seed:check
```

It checks totals, per-subject counts, unique IDs and text, option integrity,
answer ranges, explanations, topic membership and source flags.

## Practice and exam modes

| Mode | Ranked? | Purpose |
| --- | --- | --- |
| Full CBT | Yes | A timed, realistic computer-based test |
| Custom examination | Yes | Build your own paper from subjects, topics and counts |
| Quick practice | No | Ten mixed questions with instant explanations |
| Subject practice | No | Deep focus on one subject |
| Topic practice | No | Drill a single topic |
| Daily challenge | No | The same ten questions for everyone that day |
| Weakness training | No | Questions from your weakest topics |
| Random challenge | No | A surprise cross-subject mix |
| Revision | No | Revisit questions you previously missed |

All modes share the same runner and save a result, so analytics remain complete.
Only full CBT and custom results feed the leaderboard and CBT milestones.

## Scoring and leaderboard integrity

- **Accuracy** is correct answers divided by total questions, rounded to a whole
  percentage.
- **Points** are `10 × correct answers`, plus a `50`-point bonus for a perfect
  paper.
- **Pass mark** defaults to 50% and is configurable by an administrator.
- **Ranking** sorts by average accuracy, then total points, then number of ranked
  examinations, then username.
- **Excluded from rankings:** guests, opted-out students, administrators and all
  practice modes.
- **No seeded scores.** Empty leaderboards are shown honestly until real
  students complete real CBTs.
- **One attempt, one result.** A refreshed page resumes the same attempt; the
  server route is stateless, and the local store saves a result once.

Seed questions are re-scored by `/api/exam/submit` so the correct answer key is
not trusted from the browser. Admin-added, imported or edited questions are
scored locally and labelled `client-demo` because the server does not hold their
answer keys in demo mode.

## Data and privacy

Everything is stored under the `ppu.v1.` prefix in browser local storage:

| Key | Contents |
| --- | --- |
| `ppu.v1.db` | Accounts, results, practice, notes, bookmarks, reports, settings, admin overrides |
| `ppu.v1.theme` | `"dark"` or `"light"` |
| `ppu.v1.exam-session` | The in-progress examination for resume |

- Passwords are salted and hashed before storage; plain text is never saved.
- Emails are never shown on public leaderboards.
- There are no advertising cookies, third-party analytics scripts or tracking
  pixels in this build.
- The service worker caches the app shell and static assets. It never caches
  `/api/` responses or admin/auth data.
- Clearing site data erases the local demo database. Administrators can download
  a JSON backup (password hashes excluded) from settings first.

See [privacy](/src/app/privacy/page.tsx) in the app for the full explanation.

## Production Supabase path

The repository includes:

- `supabase/schema.sql` — tables, indexes, triggers, RLS policies, avatar storage
  policies and a secure `get_leaderboard()` function.
- `supabase/seed.sql` — platform settings.
- `scripts/export-questions.ts` — generates `questions.seed.sql` and
  `questions.seed.json` for the 800-question bank.
- `supabase/README.md` — setup, promotion, RLS checklist and adapter mapping.

This build deliberately **does not claim** Supabase is live. The UI always uses
the demo store; the env flag is reserved for an adapter you implement and test.
The admin settings screen labels Supabase as “Prepared”, not “Enabled”, and the
demo store remains authoritative until that work is done.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint with Next.js core-web-vitals and TypeScript rules |
| `npm run typecheck` | Strict TypeScript check |
| `npm test` | Run all Vitest unit tests |
| `npm run test:watch` | Watch mode |
| `npm run seed:check` | Validate the 800-question bank |
| `npm run export:questions` | Generate Supabase seed files from the bank |

## Testing

The test suite covers the parts where correctness matters most:

- **Questions** — totals, per-subject counts, unique IDs/text, option and answer
  integrity, topic membership and deterministic selection.
- **Scoring** — correct/incorrect/unanswered counts, percentages, perfect bonus,
  pass marks, snapshots and clamping.
- **Import** — CSV/JSON parsing, subject normalisation, numeric answers, duplicate
  detection and missing headers.
- **Leaderboards** — eligibility, accuracy-first ranking, tie-breakers, period
  filters, subject filters, personal rank and limits.
- **Utilities** — CSV quoting/newlines, percentages, durations, ratings, email,
  password and username validation.
- **Exam** — ranked modes, session creation, resume snapshots, server-scoring
  eligibility and practice attempts.
- **Flows** — seeded demo logins, registration and duplicate rejection, guest
  isolation, result persistence and deduplication, bookmarks/notes, admin
  question CRUD and overrides, settings, account deletion and demo reset.

```bash
npm test
```

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
4. Build command: `npm run build`. Output: Next.js default.
5. Deploy.

The app runs in demo mode with no other variables. Browser data is per device.
If you enable a hosted adapter later, add the Supabase variables from
`.env.example` and never expose the service role key.

### Other platforms

Any Node.js host that supports Next.js 15 works. Run `npm install`,
`npm run build` and `npm start`. The service worker requires HTTPS in
production; it is disabled on insecure origins except localhost.

## Project structure

```text
src/
  app/
    (app)/                 authenticated shell
      admin/               questions, import, students, reports, settings
      dashboard, practice, exam, results, leaderboard, achievements,
      subjects, library, universities, notifications, profile, planner
    api/
      exam/submit/         server-side seed scoring
      health/              health check
    about, privacy, offline, login, register, forgot/reset password
  components/
    auth, brand, charts, exam, layout, providers, pwa, subjects, ui
  lib/
    questions/             16 subject files + selection helpers (800 questions)
    achievements, demo-db, exam, import, leaderboard, performance,
    scoring, storage, subjects, types, universities, utils
supabase/
  schema.sql, seed.sql, README.md
scripts/
  validate-questions.ts, export-questions.ts
tests/
  questions, scoring, import, leaderboard, utils, exam
```

## Known limitations

- Demo accounts and data are local to one browser profile; they do not sync
  across devices.
- Demo mode is **not a security boundary**. Administrator checks and RBAC are
  enforced in the UI, but all demo data lives in the same browser storage that
  the user controls. Do not treat the demo admin area as protected until you
  move accounts and records to Supabase, where the RLS policies in
  `supabase/schema.sql` enforce access on the server.
- Supabase schema and policies are provided, but the hosted adapter is not wired
  into the UI. This is documented rather than hidden.
- Custom/imported questions are scored locally in demo mode and labelled
  `client-demo`; production scoring should validate every answer on the server.
- Password reset is a demo flow; it does not send email.
- University guides are general reference material, not official admission
  advice. Cut-off marks and screening dates change yearly and are intentionally
  not published.
- The project is not affiliated with JAMB, any university or any examination
  body.

## Contributing

1. Create a branch.
2. Keep TypeScript strict and follow the existing component patterns.
3. Add or update tests for logic changes.
4. Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run seed:check`
   and `npm run build`.
5. Open a pull request with a clear description and screenshots for UI changes.

For question corrections, include the question ID, the proposed wording, the
correct answer and a short explanation.

## License

MIT © 2026 PRAISE POST UTME. See [LICENSE](./LICENSE).
