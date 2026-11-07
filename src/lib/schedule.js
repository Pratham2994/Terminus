import { SHEET, ITEM_BY_KEY } from './sheet'
import { addDays, dayString, daysBetween, weekStart } from './dates'

// Days until the next review after reaching each stage (1 -> 3 days, 2 -> 7, 3 -> 21).
export const REVIEW_GAP = { 1: 3, 2: 7, 3: 21 }
export const GRADUATED = 4
export const REDO_PER_DAY = 2

// Progress row after a first solve.
export function afterNewSolve(item, today) {
  if (item.lesson) return { status: 'done', stage: GRADUATED, next_review: null }
  return { status: 'done', stage: 1, next_review: addDays(today, REVIEW_GAP[1]) }
}

// Progress row after a review. Clean moves the item one stage on; struggled starts again.
export function afterReview(row, result, today) {
  if (result === 'struggled') return { status: 'done', stage: 1, next_review: addDays(today, REVIEW_GAP[1]) }
  const stage = Math.min((row.stage || 1) + 1, GRADUATED)
  return { status: 'done', stage, next_review: stage >= GRADUATED ? null : addDays(today, REVIEW_GAP[stage]) }
}

function localDay(ts) {
  return dayString(new Date(ts))
}

// Builds the two lists on the Today board.
export function planToday({ progress, attempts, budget, extra = 0, today = dayString() }) {
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

  const open = SHEET.items.filter((it) => !progress.has(it.key))
  return {
    redo: due.slice(0, REDO_PER_DAY),
    redoWaiting: Math.max(0, due.length - REDO_PER_DAY),
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
