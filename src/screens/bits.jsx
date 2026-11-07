import { ExternalLink } from 'lucide-react'
import { resources } from '../lib/sheet'
import { hasEditorial } from '../lib/editorials'
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

// The free links for a station, in the order to use them.
export function LinkSet({ item, hideOwn = false }) {
  const list = resources(item).filter((r) => !(hideOwn && r.internal))
  return (
    <div className="link-set">
      {list.map((r) => (
        <a
          key={r.kind}
          className={`btn link-${r.kind}`}
          href={r.href}
          title={r.title}
          {...(r.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {r.label}
          <small>{r.site}</small>
          {!r.internal && <ExternalLink size={14} aria-hidden="true" />}
        </a>
      ))}
      {!item.lesson && item.plusOnly && !item.leetcode && (
        <p className="link-note">
          takeUforward’s problem page needs Plus.{' '}
          {item.judge
            ? item.judge.similar
              ? `${item.judge.site} has a free, similar version: it ${item.judge.similar}.`
              : `Solve the same problem free on ${item.judge.site}.`
            : hasEditorial(item.key)
            ? 'The Terminus editorial explains it and names a free place to practise.'
            : item.editorial
              ? 'The free editorial has the full statement.'
              : item.video
                ? 'The video explains the statement.'
                : 'Nothing free there, so search for it.'}
        </p>
      )}
    </div>
  )
}
