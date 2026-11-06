# Terminus — plan

A DSA practice tracker built on **Striver's A2Z DSA sheet**, for two people (Pratham and his girlfriend).
Its job: show each day **what to redo** and **what to do new**, with links to Striver's pages, so the
sheet gets finished and nothing is forgotten.

Status: agreed on 2026-11-07. First version built on 2026-11-07 (see README.md). Schema in `supabase/schema.sql` is applied to the project.

## Decisions (agreed with Pratham)

- **Name:** Terminus (repo `Pratham2994/Terminus`).
- **Stack:** React + Vite (static site on Vercel) + **Supabase** (Postgres, Google OAuth, row-level
  security). No own server.
- **Login:** "Sign in with Google" (OAuth through Supabase).
- **Devices:** phone and laptop, data synced.
- **Language for solutions:** C++ (the kit is C++).
- **Problem list:** all **495** A2Z items in Striver's exact order: 453 practice problems + 42 theory
  lessons, 20 topics, 95 sections. Read from takeuforward.org on 2026-11-07
  (`backend-go.takeuforward.org/api/v2/syllabus/track`, needs a signed-in session).
  - practice link: `https://takeuforward.org/practice/dsa/<slug>`
  - lesson link: `https://takeuforward.org/learning/dsa/<slug>?source=strivers-a2z-dsa-sheet`
  - store per item: topic, section, label, slug, type (practice/theory), video duration, order.
  - do **not** copy Striver's statements, editorials or videos; link to them.
- **Start from zero.** No import of takeUforward progress. Each item has an **"I know this"** tick that
  skips it without reviews (can be unticked).
- **Weekly budget in problems** (new problems per week). Starts at **4 per week**, adjustable. Spread over
  the days; a missed day moves work forward, no streaks, no guilt.
- **Reviews** after 3, 7 and 21 days. Marking a review "clean" moves it on, "struggled" resets the
  schedule. Reviews are separate from the budget, capped at 2 per day.
- **Today screen** has two lists only: **Redo** (due reviews, with the reason, e.g. "solved 7 days
  ago") and **Do today** (next new items from the budget), each with the Striver link.
- **Solving flow:** a timer with checkpoints: plan by 5 min, first half of the video at 20-25 min, full
  solution at about 40 min, then write the code from memory. After solving, one note: pattern, key idea,
  mistake, and **time and space complexity written by the user** before checking the solution.
- **Look:** a **metro map**. Each topic is a coloured line, each item a station that lights up when
  solved and shows a ring when a review is due. Today's work is a **departures board**. It must look
  specific to this subject, not like a generic template. Simple and fast to use.
- **Kit tab (C++):** Big-O guide (counting loops, log n, recursion trees, amortised, input-size table:
  about 10^8 simple steps per second), STL cheat sheet (sort with comparator, map vs unordered_map,
  min-heap priority_queue, lower_bound, deque), bits (`x&1`, `x&(x-1)`, `x&-x`, `__builtin_popcount`,
  subset loop), math (gcd/lcm, fast power mod, `1e9+7`, sieve, nCr, `long long` overflow), templates
  (binary search, sliding window, grid BFS, DFS, backtracking, union-find, Dijkstra, topological sort,
  memo DP).

## Safety (must hold)

- Row-level security on every user table: a user reads and writes only rows with their own user id.
  Test with two accounts.
- The problem list table is read-only for users.
- Only the Supabase URL and **anon** key in the client. Never the service key. No secrets committed.
- Google OAuth client secret only in the Supabase dashboard.
- Redirect URL allowlist: the Vercel domain and localhost only.
- Sign-up is open to anyone with a Google account (decided 2026-11-07). Row-level security keeps each
  user's data private.
- The client uses only the **publishable** key. The secret key is never in the app or the repo.

## What Pratham must set up (about 15 minutes)

1. Supabase: create a free project. Send the **Project URL** and **anon public key** (Settings → API).
   Do not send the service_role key.
2. Google Cloud: create an OAuth client (Web application). Authorised redirect URI = the callback URL
   shown in Supabase → Authentication → Providers → Google. Paste the client ID and secret into that
   Supabase page and enable Google.
3. Vercel: import the `Terminus` repo (after the first push), framework Vite. Add env vars
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Supabase → Authentication → URL Configuration: Site URL = the Vercel URL; redirect URLs = the Vercel
   URL and `http://localhost:5173`.
5. Answer the allowlist question.
