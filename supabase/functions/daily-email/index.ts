// Terminus reminder emails. Runs every hour (pg_cron, see
// supabase/002_reviews_notes_partners_email.sql) and sends, in each user's
// own time zone:
//   08:00  morning board: today's reviews and new stations
//   21:00  evening nudge: only on a day with no session
//   Sunday 19:00  weekly summary, with the partner's week
// Mail goes out through Gmail (GMAIL_USER + GMAIL_APP_PASSWORD secrets).
// Deploy with "Verify JWT" OFF: the caller proves itself with x-cron-secret.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'
import nodemailer from 'npm:nodemailer@6.9.16'

const SHEET_URL = 'https://raw.githubusercontent.com/Pratham2994/Terminus/master/src/data/a2z.txt'
const APP_URL = Deno.env.get('APP_URL') ?? 'https://terminus-lime.vercel.app'
const REVIEW_GAP: Record<number, number> = { 1: 3, 2: 7, 3: 21 }

type Item = { key: string; slug: string; label: string; lesson: boolean; order: number; line: string; section: string }
type Row = { user_id: string; item_key: string; status: string; stage: number; next_review: string | null; done_at: string | null }
type Attempt = { user_id: string; item_key: string; kind: string; result: string; created_at: string }

// ---------- Sheet (same rules as src/lib/sheet.js) ----------

let SHEET: Item[] | null = null

async function sheet(): Promise<Item[]> {
  if (SHEET) return SHEET
  const text = await (await fetch(SHEET_URL)).text()
  const items: Item[] = []
  const seen = new Map<string, number>()
  let line = ''
  let section = ''
  for (const raw of text.split(/\r?\n/)) {
    const row = raw.trim()
    if (!row) continue
    if (row.startsWith('#')) {
      line = row.slice(1).trim()
      continue
    }
    if (row.startsWith('@')) {
      section = row.slice(1).trim()
      continue
    }
    const parts = row.split('|')
    const [type, , slug] = parts
    const n = (seen.get(slug) ?? 0) + 1
    seen.set(slug, n)
    items.push({
      key: n === 1 ? slug : `${slug}~${n}`,
      slug,
      label: parts.slice(3).join('|').trim(),
      lesson: type === 'T',
      order: items.length,
      line,
      section,
    })
  }
  SHEET = items
  return items
}

function link(it: Item) {
  const slug = encodeURIComponent(it.slug).replace(/'/g, '%27')
  return it.lesson
    ? `https://takeuforward.org/learning/dsa/${slug}?source=strivers-a2z-dsa-sheet`
    : `https://takeuforward.org/practice/dsa/${slug}`
}

// ---------- Dates in a user's time zone ----------

function partsIn(tz: string, date = new Date()) {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  })
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]))
  return { day: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour), weekday: p.weekday as string }
}

function dayIn(tz: string, iso: string) {
  return partsIn(tz, new Date(iso)).day
}

function addDays(day: string, n: number) {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000)
}

function weekStart(day: string) {
  const dow = (new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7
  return addDays(day, -dow)
}

// ---------- Today's plan (same rules as planToday in src/lib/schedule.js) ----------

function reviewsPerDay(due: number) {
  return Math.min(5, Math.max(2, Math.ceil(due / 3)))
}

function plan(items: Item[], rows: Row[], attempts: Attempt[], budget: number, tz: string, today: string) {
  const byKey = new Map(items.map((it) => [it.key, it]))
  const progress = new Map(rows.map((r) => [r.item_key, r]))
  const due = rows
    .filter((r) => r.status === 'done' && r.next_review && r.next_review <= today && byKey.has(r.item_key))
    .sort((a, b) => (a.next_review! < b.next_review! ? -1 : a.next_review! > b.next_review! ? 1 : 0))
  const reviewedToday = new Set(
    attempts
      .filter((a) => a.kind === 'review' && dayIn(tz, a.created_at) === today && progress.get(a.item_key)?.status === 'done')
      .map((a) => a.item_key),
  )
  const pending = due.filter((r) => !reviewedToday.has(r.item_key))
  const redoCount = Math.max(0, reviewsPerDay(pending.length + reviewedToday.size) - reviewedToday.size)

  const monday = weekStart(today)
  let doneThisWeek = 0
  let doneToday = 0
  for (const r of rows) {
    if (r.status !== 'done' || !r.done_at) continue
    const d = dayIn(tz, r.done_at)
    if (d >= monday) doneThisWeek++
    if (d === today) doneToday++
  }
  const daysLeft = 7 - daysBetween(monday, today)
  const remainingAtDawn = Math.max(0, budget - (doneThisWeek - doneToday))
  const count = Math.max(0, Math.ceil(remainingAtDawn / daysLeft) - doneToday)
  const open = items.filter((it) => !progress.has(it.key))
  return {
    redo: pending.slice(0, redoCount).map((r) => ({ item: byKey.get(r.item_key)!, row: r, late: daysBetween(r.next_review!, today) })),
    redoWaiting: Math.max(0, pending.length - redoCount),
    fresh: open.slice(0, count),
    doneThisWeek,
    remaining: open.length,
  }
}

// ---------- Email ----------

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

function page(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#0d1014;padding:24px 12px;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#ece6d8">
<div style="max-width:560px;margin:0 auto">
<p style="margin:0 0 18px;font-weight:800;letter-spacing:.14em;color:#ffb22e">TERMINUS</p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#ece6d8">${esc(title)}</h1>
${body}
<p style="margin:28px 0 0"><a href="${APP_URL}" style="display:inline-block;background:#ffb22e;color:#1a1204;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:999px">Open Terminus</a></p>
<p style="margin:28px 0 0;font-size:12px;color:#8d8778">Change which emails you get in Terminus → Settings → Emails.</p>
</div></body></html>`
}

function list(title: string, rows: { label: string; sub: string; href: string }[]) {
  if (!rows.length) return ''
  return `<p style="margin:20px 0 8px;font-size:12px;font-weight:800;letter-spacing:.12em;color:#b9b2a3">${esc(title)}</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #2b3541;border-radius:12px;background:#141920">
${rows
  .map(
    (r, i) => `<tr><td style="padding:12px 14px;${i ? 'border-top:1px solid #2b3541;' : ''}">
<a href="${r.href}" style="color:#ffb22e;font-weight:700;text-decoration:none">${esc(r.label)}</a>
<div style="color:#8d8778;font-size:13px;margin-top:2px">${esc(r.sub)}</div></td></tr>`,
  )
  .join('')}
</table>`
}

function boardBody(p: ReturnType<typeof plan>) {
  const redo = p.redo.map(({ item, row, late }) => ({
    label: item.label,
    sub: `Review ${row.stage} of 3${late > 0 ? ` • ${late}d late` : ''} • recall it first in Terminus`,
    href: APP_URL,
  }))
  const fresh = p.fresh.map((it) => ({ label: it.label, sub: `${it.line} • ${it.section}`, href: link(it) }))
  let extra = ''
  if (p.redoWaiting) extra += `<p style="color:#b9b2a3;margin:12px 0 0">${p.redoWaiting} more reviews wait after these.</p>`
  return list('REDO', redo) + list('TODAY', fresh) + extra
}

// ---------- Handler ----------

Deno.serve(async (req) => {
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

  const { data: secret } = await db.rpc('terminus_cron_secret')
  if (!secret || req.headers.get('x-cron-secret') !== secret) return new Response('Forbidden', { status: 403 })

  const user = Deno.env.get('GMAIL_USER')
  const pass = Deno.env.get('GMAIL_APP_PASSWORD')
  if (!user || !pass) return new Response('Missing GMAIL_USER or GMAIL_APP_PASSWORD', { status: 500 })
  const mail = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } })

  const items = await sheet()
  const { data: people, error } = await db
    .from('settings')
    .select('user_id,display_name,weekly_budget,timezone,email_morning,email_evening,email_weekly')
  if (error) return new Response(error.message, { status: 500 })

  // A test run ({"test": true} in the body) sends one "morning" email to
  // everyone now, whatever the hour, without marking the day as sent.
  let test = false
  try {
    test = (await req.json())?.test === true
  } catch {
    /* no body */
  }

  const sent: string[] = []
  const skipped: string[] = []
  for (const s of people ?? []) {
    const tz = s.timezone || 'Asia/Kolkata'
    let now
    try {
      now = partsIn(tz)
    } catch {
      continue
    }
    const kind = test
      ? 'morning'
      : now.weekday === 'Sun' && now.hour === 19 && s.email_weekly
        ? 'weekly'
        : now.hour === 8 && s.email_morning
          ? 'morning'
          : now.hour === 21 && s.email_evening
            ? 'evening'
            : null
    if (!kind) continue

    const since = new Date(Date.now() - 9 * 86400000).toISOString()
    const [rows, atts, who] = await Promise.all([
      db.from('progress').select('user_id,item_key,status,stage,next_review,done_at').eq('user_id', s.user_id).limit(5000),
      db.from('attempts').select('user_id,item_key,kind,result,created_at').eq('user_id', s.user_id).gte('created_at', since),
      db.auth.admin.getUserById(s.user_id),
    ])
    const email = who.data?.user?.email
    if (!email || rows.error || atts.error) continue
    const p = plan(items, rows.data as Row[], atts.data as Attempt[], s.weekly_budget, tz, now.day)
    const first = (s.display_name || 'there').split(' ')[0]

    let subject = ''
    let html = ''
    if (kind === 'morning') {
      if (!p.redo.length && !p.fresh.length && !test) continue
      subject = `${test ? '[Test] ' : ''}Today: ${p.redo.length} ${p.redo.length === 1 ? 'review' : 'reviews'}, ${p.fresh.length} new`
      html = page(`Good morning, ${first}. Your board is ready.`, boardBody(p))
    } else if (kind === 'evening') {
      const rodeToday = (atts.data as Attempt[]).some((a) => dayIn(tz, a.created_at) === now.day)
      if (rodeToday || (!p.redo.length && !p.fresh.length)) continue
      subject = 'Your train is still at the platform'
      html = page(
        `${first}, one station before bed?`,
        `<p style="color:#b9b2a3;margin:0">Nothing logged today yet. Even one review keeps the line moving.</p>` + boardBody(p),
      )
    } else {
      const monday = weekStart(now.day)
      const weekRows = (rows.data as Row[]).filter((r) => r.status === 'done' && r.done_at && dayIn(tz, r.done_at) >= monday)
      const weekReviews = (atts.data as Attempt[]).filter((a) => a.kind === 'review' && dayIn(tz, a.created_at) >= monday)
      const clean = weekReviews.filter((a) => a.result === 'clean').length
      let partnerLine = ''
      const links = await db.from('partners').select('partner_id').eq('user_id', s.user_id)
      for (const l of links.data ?? []) {
        const [ps, pr] = await Promise.all([
          db.from('settings').select('display_name,weekly_budget').eq('user_id', l.partner_id).maybeSingle(),
          db.from('progress').select('status,done_at').eq('user_id', l.partner_id).eq('status', 'done').limit(5000),
        ])
        const n = (pr.data ?? []).filter((r) => r.done_at && dayIn(tz, r.done_at) >= monday).length
        partnerLine += `<p style="margin:8px 0 0;color:#b9b2a3">${esc((ps.data?.display_name || 'Your partner').split(' ')[0])}: ${n}/${ps.data?.weekly_budget ?? 4} new this week.</p>`
      }
      subject = `Your week: ${weekRows.length}/${s.weekly_budget} new, ${weekReviews.length} reviews`
      html = page(
        `${first}, here is your week.`,
        `<p style="margin:0;font-size:18px"><b style="color:#ffb22e">${weekRows.length}/${s.weekly_budget}</b> new stations • <b style="color:#ffb22e">${weekReviews.length}</b> reviews (${clean} clean)</p>
<p style="margin:8px 0 0;color:#b9b2a3">${p.remaining} stations left on the sheet.</p>${partnerLine}`,
      )
    }

    // Claim the slot first, so a retry or a second run never sends twice.
    if (!test) {
      const claim = await db.from('email_log').insert({ user_id: s.user_id, kind, day: now.day })
      if (claim.error) continue
    }
    try {
      await mail.sendMail({ from: `Terminus <${user}>`, to: email, subject, html })
      sent.push(`${kind}:${email}`)
    } catch (e) {
      if (!test) await db.from('email_log').delete().match({ user_id: s.user_id, kind, day: now.day })
      skipped.push(`${email}: ${String(e).slice(0, 200)}`)
      console.error('send failed', s.user_id, String(e))
    }
  }

  return new Response(JSON.stringify({ test, sent, failed: skipped }), { headers: { 'Content-Type': 'application/json' } })
})
