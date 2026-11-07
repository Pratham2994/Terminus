import { useEffect, useRef, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { primaryLink } from '../lib/sheet'
import { stationState } from '../lib/schedule'
import { prettyDay } from '../lib/dates'
import { LineBadge, LinkSet, STAGE_TEXT, kindText } from './bits'
import { NoteView, RESULT_TEXT, hasNote } from './noteBits'


export default function StationSheet({ item, state, actions, run, say, ride, onBoard, onClose }) {
  const [history, setHistory] = useState(null)
  const [busy, setBusy] = useState(false)
  const panel = useRef(null)
  const row = state.progress.get(item.key)
  const st = stationState(item, state.progress)

  useEffect(() => {
    let live = true
    setHistory(null)
    actions
      .history(item)
      .then((h) => live && setHistory(h))
      .catch(() => live && setHistory([]))
    return () => {
      live = false
    }
  }, [item, actions, row?.updated_at])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Runs a change and offers Undo, which puts the old row back.
  const act = async (fn, message) => {
    const before = row
    setBusy(true)
    const ok = await run(fn)
    setBusy(false)
    if (ok) say(message, () => actions.restore(item, before))
  }

  const start = (kind) => {
    // A review starts with recall; its page opens from the Ride screen.
    if (kind === 'new') window.open(primaryLink(item), '_blank', 'noopener')
    onBoard(item, kind)
  }

  let status
  if (st === 'open') status = 'Not reached yet.'
  else if (st === 'skipped') status = 'Skipped. It stays off your Today board.'
  else if (st === 'known') status = 'Marked as known. No reviews.'
  else if (st === 'mastered') status = item.lesson ? 'Lesson done.' : 'Mastered. All three reviews were clean.'
  else if (st === 'due') status = `${STAGE_TEXT[row.stage] || 'Review'} is due now.`
  else status = `${STAGE_TEXT[row.stage] || 'Review'} on ${prettyDay(row.next_review)}.`

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <aside
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        style={{ '--c': item.line.color }}
        onClick={(e) => e.stopPropagation()}
        ref={panel}
        tabIndex={-1}
      >
        <header className="sheet-head">
          <LineBadge line={item.line} />
          <div>
            <h2 id="sheet-title">{item.label}</h2>
            <p>
              {item.section} • {kindText(item)}
            </p>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <p className="sheet-status">
          {status}
          {(st === 'open' || st === 'due') && ride && (
            <span className="muted"> Finish your current ride to start this one.</span>
          )}
        </p>

        <LinkSet item={item} />

        <div className="sheet-actions">
          {(st === 'open' || st === 'due') && !ride && (
            <button className="btn btn-go" onClick={() => start(st === 'due' ? 'review' : 'new')}>
              {st === 'due' ? 'Start review' : 'Start now'} {st !== 'due' && <ExternalLink size={15} aria-hidden="true" />}
            </button>
          )}
          {st === 'open' && (
            <>
              <button className="btn btn-quiet" disabled={busy} onClick={() => act(() => actions.mark(item, 'known'), 'Marked as known.')}>
                I know this
              </button>
              <button className="btn btn-quiet" disabled={busy} onClick={() => act(() => actions.mark(item, 'skipped'), 'Skipped.')}>
                Skip
              </button>
            </>
          )}
          {(st === 'known' || st === 'skipped') && (
            <button className="btn btn-quiet" disabled={busy} onClick={() => act(() => actions.clear(item), 'Back on the line.')}>
              Undo, put it back on the line
            </button>
          )}
          {(st === 'done' || st === 'due' || st === 'mastered') && (
            <button
              className="btn btn-quiet"
              disabled={busy}
              title="Marks it as not done. Your notes stay."
              onClick={() => act(() => actions.clear(item), 'Station reset. Your notes stay.')}
            >
              Reset station
            </button>
          )}
        </div>

        <section className="sheet-history" aria-label="Your notes">
          <h3>Your notes</h3>
          {history === null ? (
            <p className="muted">Loading…</p>
          ) : history.length === 0 ? (
            <p className="muted">No attempts yet.</p>
          ) : (
            <ol>
              {history.map((a) => (
                <li key={a.id}>
                  <p className="h-top">
                    <span className={`h-result r-${a.result}`}>
                      {item.lesson && a.kind === 'new' ? 'Lesson done' : RESULT_TEXT[a.result]}
                    </span>
                    <span className="mono">
                      {new Date(a.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      {a.minutes ? ` • ${a.minutes} min` : ''}
                    </span>
                  </p>
                  {hasNote(a) && <NoteView note={a} />}
                </li>
              ))}
            </ol>
          )}
        </section>
      </aside>
    </div>
  )
}
