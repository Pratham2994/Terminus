// All scheduling uses the user's local calendar day as 'YYYY-MM-DD'.

export function dayString(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDay(day) {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(day, n) {
  const date = parseDay(day)
  date.setDate(date.getDate() + n)
  return dayString(date)
}

export function daysBetween(fromDay, toDay) {
  return Math.round((parseDay(toDay) - parseDay(fromDay)) / 86400000)
}

// Monday of the week that contains `day`.
export function weekStart(day) {
  const date = parseDay(day)
  const offset = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - offset)
  return dayString(date)
}

export function prettyDay(day) {
  return parseDay(day).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
}

export function agoText(n) {
  if (n <= 0) return 'today'
  if (n === 1) return 'yesterday'
  return `${n} days ago`
}
