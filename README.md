# Terminus

Striver's A2Z DSA sheet as a metro network. Each topic is a line, each problem a station.
Every day the departures board shows two things: the reviews that are due, and the next new
stations from a small weekly budget. Each one links to its page on takeUforward.

## What it does

- **Today** — a departures board. *Redo* lists up to two due reviews; *Today* lists the new
  stations your weekly budget gives you for the day. A missed day moves work forward.
- **Ride** — pressing *Start* opens Striver's page and starts a timer on a short line:
  plan by 5 min, half the video at about 22 min, the full solution at 40 min, then code it from
  memory. When you finish, log how it went, your own time and space complexity, the pattern, the
  key idea and your mistake.
- **Reviews** — a solved problem returns after 3, 7 and 21 days. *Clean* moves it on,
  *Struggled* restarts the loop. Lessons have no reviews.
- **Map** — all 20 lines and 495 stations, with each station's state and your notes.
  Search by name, section or line (press `/`), and filter by state.
  *I know this*, *Skip* and *Reset* live here, each with Undo.
- **Stats** — stations reached, mastered and due; a 20-week activity grid; clean-review rate;
  how you solve (alone, hint, solution); top patterns; shaky stations; progress per line.
- **Kit** — a C++ cheat sheet: Big-O, STL, bits, math, templates, and what to do when stuck.

Lessons for Java and Python start as skipped, because the kit is C++. Undo that on the map.

## Stack

React + Vite (static), Supabase for Google sign-in and Postgres. There is no server of our own.
Row-level security limits every row to its owner, so each person sees only their own progress.

The sheet lives in `src/data/a2z.txt` (order, sections, slugs and video lengths read from
takeuforward.org on 2026-11-07). Terminus links to takeUforward and copies none of its content.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm run dev                  # http://localhost:5173
```

## Set up your own copy

1. Create a Supabase project. Run `supabase/schema.sql` in its SQL editor.
2. Create a Google OAuth client (Web application). Its redirect URI is the callback URL shown in
   Supabase → Authentication → Sign In / Providers → Google. Paste the client ID and secret there.
3. Supabase → Authentication → URL Configuration: add your site URL and `http://localhost:5173`.
4. Deploy to Vercel (framework: Vite) with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Only the publishable (anon) key belongs in the client. Never put the secret or service-role key
in this app or in the repo.
