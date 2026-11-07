import { SHEET, ITEM_BY_KEY } from './sheet'
import { addDays, dayString, daysBetween, weekStart } from './dates'

// Days until the next review after reaching each stage (1 -> 3 days, 2 -> 7, 3 -> 21).
export const REVIEW_GAP = { 1: 3, 2: 7, 3: 21 }
export const GRADUATED = 4
export const REDO_PER_DAY = 2
export const REDO_MAX = 5

// Reviews a day: 2 normally, more when a backlog builds up (a third of the
// pile, at most 5), so the pile shrinks instead of growing.
export function reviewsPerDay(dueAtDawn) {
  return Math.min(REDO_MAX, Math.max(REDO_PER_DAY, Math.ceil(dueAtDawn / 3)))
}

// Progress row after a first solve.
export function afterNewSolve(item, today) {
  if (item.lesson) return { status: 'done', stage: GRADUATED, next_review: null }
  return { status: 'done', stage: 1, next_review: addDays(today, REVIEW_GAP[1]) }
}

// Progress row after a review. Clean moves the item one stage on; struggled starts again.
export function afterReview(row, result, today) {
  // Forgot completely: start the loop again, and see it again tomorrow.
  if (result === 'forgot') return { status: 'done', stage: 1, next_review: addDays(today, 1) }
  if (result === 'struggled') return { status: 'done', stage: 1, next_review: addDays(today, REVIEW_GAP[1]) }
  const stage = Math.min((row.stage || 1) + 1, GRADUATED)
  return { status: 'done', stage, next_review: stage >= GRADUATED ? null : addDays(today, REVIEW_GAP[stage]) }
}

function localDay(ts) {
  return dayString(new Date(ts))
}

// Builds the two lists on the Today board.
export function planToday({ progress, attempts, budget, extra = 0, redoExtra = 0, today = dayString() }) {
  const lastSeen = new Map()
  for (const a of attempts) {
    const d = localDay(a.created_at)
    const prev = lastSeen.get(a.item_key)
    if (!prev || prev < d) lastSeen.set(a.item_key, d)
  }

  const due = []
  for (const row of progress.values()) {
    if (row.status !== 'done' || !row.next_review || row.next_review > today) continue
    const item = ITEM_BY_KEY.get(row.item_key)
    if (!item) continue
    const seen = lastSeen.get(row.item_key) || (row.done_at ? localDay(row.done_at) : row.next_review)
    due.push({ item, row, ago: daysBetween(seen, today), late: daysBetween(row.next_review, today) })
  }
  due.sort((a, b) => (a.row.next_review < b.row.next_review ? -1 : a.row.next_review > b.row.next_review ? 1 : a.item.order - b.item.order))

  // Count solves from the progress rows, not the attempt log, so a reset
  // station stops counting and comes back on the board.
  const monday = weekStart(today)
  let doneThisWeek = 0
  let doneToday = 0
  for (const row of progress.values()) {
    if (row.status !== 'done' || !row.done_at) continue
    const d = localDay(row.done_at)
    if (d >= monday) doneThisWeek++
    if (d === today) doneToday++
  }
  const daysLeft = 7 - daysBetween(monday, today)
  const remainingAtDawn = Math.max(0, budget - (doneThisWeek - doneToday))
  const targetToday = Math.ceil(remainingAtDawn / daysLeft)
  const count = Math.max(0, targetToday + extra - doneToday)

  // Reviews done today count against today's review number, which is fixed
  // from the pile as it was in the morning. Without this, finishing one
  // review would pull the next one in, all day long.
  const reviewedToday = new Set()
  for (const a of attempts) {
    if (a.kind === 'review' && localDay(a.created_at) === today && progress.get(a.item_key)?.status === 'done') {
      reviewedToday.add(a.item_key)
    }
  }
  const pending = due.filter((d) => !reviewedToday.has(d.item.key))
  const redoTarget = reviewsPerDay(pending.length + reviewedToday.size)
  const redoCount = Math.max(0, redoTarget + redoExtra - reviewedToday.size)

  const open = SHEET.items.filter((it) => !progress.has(it.key))
  return {
    redo: pending.slice(0, redoCount),
    redoWaiting: Math.max(0, pending.length - redoCount),
    redoTarget,
    reviewedToday: reviewedToday.size,
    fresh: open.slice(0, count),
    nextUp: open[count] || null,
    doneThisWeek,
    doneToday,
    budget,
    daysLeft,
    finishedSheet: open.length === 0,
  }
}

// Totals for a line on the map.
export function lineStats(line, progress) {
  let done = 0
  let total = 0
  for (const it of line.items) {
    const row = progress.get(it.key)
    if (row?.status === 'skipped') continue
    total++
    if (row) done++
  }
  return { done, total }
}

export function stationState(item, progress, today = dayString()) {
  const row = progress.get(item.key)
  if (!row) return 'open'
  if (row.status === 'skipped') return 'skipped'
  if (row.status === 'known') return 'known'
  if (row.next_review && row.next_review <= today) return 'due'
  if (row.stage >= GRADUATED) return 'mastered'
  return 'done'
}

// When the sheet ends at the current budget, and what a goal date needs.
export function projection({ progress, budget, finishBy, today = dayString() }) {
  const remaining = SHEET.items.filter((it) => !progress.has(it.key)).length
  const weeks = budget > 0 ? Math.ceil(remaining / budget) : Infinity
  const finishAt = remaining === 0 ? today : Number.isFinite(weeks) ? addDays(today, weeks * 7) : null
  let need = null
  let onPace = null
  if (finishBy && remaining > 0) {
    const days = daysBetween(today, finishBy)
    need = days <= 0 ? null : Math.ceil(remaining / (days / 7))
    onPace = need !== null && budget >= need
  }
  return { remaining, finishAt, need, onPace, late: Boolean(finishBy) && daysBetween(today, finishBy) <= 0 && remaining > 0 }
}
