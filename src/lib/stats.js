import { SHEET, ITEM_BY_KEY } from './sheet'
import { addDays, dayString, weekStart } from './dates'
import { GRADUATED, lineStats } from './schedule'

export const GRID_WEEKS = 20

function localDay(ts) {
  return dayString(new Date(ts))
}

// Everything the Stats tab shows, from progress rows and loaded attempts.
export function computeStats({ progress, attempts, today = dayString() }) {
  let solved = 0
  let mastered = 0
  let known = 0
  let skipped = 0
  let due = 0
  const stages = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const row of progress.values()) {
    const item = ITEM_BY_KEY.get(row.item_key)
    if (!item) continue
    if (row.status === 'skipped') skipped++
    else if (row.status === 'known') known++
    else if (row.status === 'done') {
      solved++
      if (row.stage >= GRADUATED) mastered++
      if (row.next_review && row.next_review <= today) due++
      if (!item.lesson && stages[row.stage] !== undefined) stages[row.stage]++
    }
  }
  const total = SHEET.items.length - skipped

  // Sessions per local day, for the activity grid.
  const perDay = new Map()
  const results = { alone: 0, hint: 0, solution: 0, clean: 0, struggled: 0, forgot: 0 }
  const struggles = new Map()
  const patterns = new Map()
  let minutes = 0
  let newMinutes = 0
  let newTimed = 0
  // The latest first solve of each station. A station that was reset and
  // solved again has older sessions from before the reset; they belong to
  // a run that was undone, so they do not count.
  const latestNew = new Map()
  for (const a of attempts) {
    if (a.kind === 'new' && !(latestNew.get(a.item_key) >= a.created_at)) latestNew.set(a.item_key, a.created_at)
  }
  const counts = (a) => {
    // A reset station keeps its notes, but its sessions no longer count.
    if (progress.get(a.item_key)?.status !== 'done') return false
    const since = latestNew.get(a.item_key)
    return !since || a.created_at >= since
  }

  for (const a of attempts) {
    if (!counts(a)) continue
    const d = localDay(a.created_at)
    perDay.set(d, (perDay.get(d) || 0) + 1)
    const item = ITEM_BY_KEY.get(a.item_key)
    if (item?.lesson) continue
    if (results[a.result] !== undefined) results[a.result]++
    minutes += a.minutes || 0
    if (a.kind === 'new' && a.minutes) {
      newMinutes += a.minutes
      newTimed++
    }
    if (a.result === 'struggled' || a.result === 'forgot') {
      const s = struggles.get(a.item_key) || { count: 0, last: '' }
      s.count++
      if (a.created_at > s.last) s.last = a.created_at
      struggles.set(a.item_key, s)
    }
    if (a.pattern) {
      const name = a.pattern.trim()
      const key = name.toLowerCase()
      const p = patterns.get(key) || { name, count: 0 }
      p.count++
      patterns.set(key, p)
    }
  }

  // The grid: GRID_WEEKS columns of Monday..Sunday, ending this week.
  const firstMonday = addDays(weekStart(today), -7 * (GRID_WEEKS - 1))
  const weeks = []
  let maxDay = 0
  for (let w = 0; w < GRID_WEEKS; w++) {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = addDays(firstMonday, w * 7 + i)
      const n = day > today ? null : perDay.get(day) || 0
      if (n > maxDay) maxDay = n
      days.push({ day, n })
    }
    weeks.push(days)
  }

  const monthStart = today.slice(0, 8) + '01'
  let activeThisMonth = 0
  let activeInGrid = 0
  for (const [d] of perDay) {
    if (d >= monthStart && d <= today) activeThisMonth++
    if (d >= firstMonday && d <= today) activeInGrid++
  }

  const shaky = [...struggles.entries()]
    .map(([key, s]) => ({ item: ITEM_BY_KEY.get(key), ...s }))
    // A mastered station had three clean reviews since; it is no longer shaky.
    .filter((s) => s.item && (progress.get(s.item.key)?.stage ?? 0) < GRADUATED)
    .sort((a, b) => b.count - a.count || (a.last < b.last ? 1 : -1))
    .slice(0, 5)

  const topPatterns = [...patterns.values()].sort((a, b) => b.count - a.count).slice(0, 6)

  const lines = SHEET.lines.map((line) => ({ line, ...lineStats(line, progress) }))

  return {
    solved,
    mastered,
    known,
    skipped,
    due,
    total,
    reached: solved + known,
    stages,
    results,
    reviews: results.clean + results.struggled + results.forgot,
    firstSolves: results.alone + results.hint + results.solution,
    minutes,
    avgNewMinutes: newTimed ? Math.round(newMinutes / newTimed) : null,
    weeks,
    maxDay,
    activeThisMonth,
    activeInGrid,
    shaky,
    topPatterns,
    lines,
  }
}
