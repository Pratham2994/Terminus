# Terminus

Striver's A2Z DSA sheet as a metro network. Each topic is a line, each problem a station.
Every day the departures board shows two things: the reviews that are due, and the next new
stations from a small weekly budget. Each one links to its page on takeUforward.

## What it does

- **Today** — a departures board. *Redo* lists the day's due reviews; *Today* lists the new
  stations your weekly budget gives you for the day. A missed day moves work forward.
- **Ride** — pressing *Start* opens Striver's page and starts a timer on a short line:
  plan by 5 min, half the video at about 22 min, the full solution at 40 min, then code it from
  memory. When you finish, log how it went, your own time and space complexity, the pattern, the
  key idea and your mistake.
- **Reviews** — a solved problem returns after 3, 7 and 21 days. A review starts from memory:
  recall the idea, reveal your old note, then solve again (timer with pause). *Clean* moves it on,
  *Struggled* restarts the 3-day loop, *Forgot completely* brings it back tomorrow. Two reviews a
  day, more (up to five) when a backlog builds up. Lessons have no reviews.
- **Notes** — every note you wrote, one card per station: search all text and code, filter by
  pattern, read older notes, edit any note.
- **Partner** — link two accounts with a one-time code. Each sees the other's week on Today, and
  their stats and notes (read only).
- **Goal** — optional finish-by date; Today shows whether your weekly budget is on pace.
- **Emails** — 08:00 board, 21:00 nudge on a day with nothing done, Sunday summary. Sent through
  Gmail by a Supabase Edge Function on an hourly schedule.
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

Free links per item (editorial, YouTube, LeetCode, and whether takeUforward's practice page needs Plus)
live in `src/data/links.txt`, in sheet order. Start opens the first free one: LeetCode, then a free
takeUforward page, then the editorial or video. Lessons open the free editorial first. LeetCode Premium
links are never used to solve; they show last, marked Premium.

53 problems with no free editorial or video have a Terminus editorial in `src/data/editorials/`
(one Markdown file per station key), shown in the app at `#editorial/<key>`. Each solution was
compiled and checked against a brute force on random inputs before it was written up.

The sheet lives in `src/data/a2z.txt` (order, sections, slugs and video lengths read from
takeuforward.org on 2026-11-07). Terminus links to takeUforward and copies none of its content.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm run dev                  # http://localhost:5173
```

## Set up your own copy

1. Create a Supabase project. Run `supabase/schema.sql`, then
   `supabase/002_reviews_notes_partners_email.sql`, in its SQL editor.
2. Create a Google OAuth client (Web application). Its redirect URI is the callback URL shown in
   Supabase → Authentication → Sign In / Providers → Google. Paste the client ID and secret there.
3. Supabase → Authentication → URL Configuration: add your site URL and `http://localhost:5173`.
4. Deploy to Vercel (framework: Vite) with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Emails (optional): deploy `supabase/functions/daily-email` with *Verify JWT* off, and set the
   function secrets `GMAIL_USER` and `GMAIL_APP_PASSWORD` (a Gmail app password). The
   schedule from step 1 calls it every hour.

Only the publishable (anon) key belongs in the client. Never put the secret or service-role key
in this app or in the repo.
