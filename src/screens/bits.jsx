import { useEffect, useState } from 'react'

export function LineBadge({ line, size = 'md' }) {
  return (
    <span className={`badge badge-${size}`} style={{ '--c': line.color }} title={line.name}>
      {line.code}
    </span>
  )
}

export function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])
  return (
    <time className="clock" dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
    </time>
  )
}

export function kindText(item) {
  if (item.lesson) return item.minutes ? `Lesson • ${item.minutes} min` : 'Lesson'
  return item.minutes ? `Problem • ${item.minutes} min video` : 'Problem'
}

export const STAGE_TEXT = { 1: 'Review 1 of 3', 2: 'Review 2 of 3', 3: 'Review 3 of 3' }
