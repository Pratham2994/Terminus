import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Pause, Play, X } from 'lucide-react'
import { ITEM_BY_KEY, primaryLink } from '../lib/sheet'
import { afterNewSolve, afterReview } from '../lib/schedule'
import { dayString, prettyDay } from '../lib/dates'
import { LineBadge, LinkSet, STAGE_TEXT, kindText } from './bits'
import { NoteView, hasNote, splitComplexity } from './noteBits'

// Stops on the solving line, in minutes.
const STOPS = [
  { at: 0, name: 'Read', tip: 'Read the problem twice. Write the input, the output and one edge case.' },
  { at: 5, name: 'Plan', tip: 'Say the brute force in one line. Then look for the better idea and write it as steps.' },
  { at: 22, name: 'Half video', tip: 'Stuck? Watch the first half of the video, only the intuition. Stop before the code.' },
  { at: 40, name: 'Solution', tip: 'Watch the full solution. Then close it and write the code from memory.' },
]
const LINE_END = 50

const PATTERNS = [
  'Brute force',
  'Two pointers',
  'Sliding window',
  'Prefix sum',
  'Hashing',
  'Binary search',
  'Binary search on answer',
  'Sorting',
  'Greedy',
  'Recursion',
  'Backtracking',
  'Divide and conquer',
  'Fast and slow pointers',
  'Monotonic stack',
  'Heap',
  'BFS',
  'DFS',
  'Topological sort',
  'Dijkstra',
  'Union-find',
  '1D DP',
  '2D DP',
  'DP on subsequences',
  'DP on strings',
  'Bit manipulation',
  'Trie',
  'Math',
  'Implementation',
]

const NEW_RESULTS = [
  ['alone', 'Solved alone'],
  ['hint', 'Needed a hint'],
  ['solution', 'Needed the solution'],
]
const REVIEW_RESULTS = [
  ['clean', 'Clean', 'Moves to the next review'],
  ['struggled', 'Struggled', 'Back to the 3-day review'],
  ['forgot', 'Forgot completely', 'Starts again, back tomorrow'],
]

function mmss(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// Time on the ride, minus any pauses.
function elapsedOf(ride, now) {
  const end = ride.pausedAt ?? now
  return Math.max(0, end - ride.startedAt - (ride.pausedMs || 0))
}

// What the arrival toast says: when the station comes back next.
function arrivalText(row) {
  if (!row.next_review) return 'Arrived. This station is mastered.'
  return `Arrived. Next review on ${prettyDay(row.next_review)}.`
}

export default function Ride({ ride, state, actions, run, say, onUpdate, onExit }) {
  const item = ITEM_BY_KEY.get(ride.key)
  const row = state.progress.get(item.key)
  // Use the station as it is now, not as it was when the ride began: it may
  // have been reset or solved on another device since.
  const review = row?.status === 'done' && !item.lesson
  // A review starts with recall, before the problem is opened.
  const phase = ride.phase || (review ? 'recall' : 'ride')
  const [now, setNow] = useState(Date.now())
  const [step, setStep] = useState('ride')
  const [leaving, setLeaving] = useState(false)
  // The note typed so far, kept when you go back to the timer.
  const [draft, setDraft] = useState(null)
  // Your last saved note for this station (reviews only).
  const [last, setLast] = useState(undefined)

  useEffect(() => {
    if (!review) return setLast(null)
    let live = true
    actions
      .history(item)
      .then((list) => live && setLast(list.find(hasNote) || null))
      .catch(() => live && setLast(null))
    return () => {
      live = false
    }
  }, [review, item, actions])

  useEffect(() => {
    if (step !== 'ride' || phase !== 'ride' || ride.pausedAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [step, phase, ride.pausedAt])

  const elapsed = elapsedOf(ride, now)
  const minutes = elapsed / 60000
  const stop = [...STOPS].reverse().find((s) => minutes >= s.at)
  const paused = Boolean(ride.pausedAt)

  const togglePause = () => {
    const t = Date.now()
    setNow(t)
    if (paused) onUpdate({ ...ride, pausedAt: null, pausedMs: (ride.pausedMs || 0) + (t - ride.pausedAt) })
    else onUpdate({ ...ride, pausedAt: t })
  }

  const startSolving = () => {
    window.open(primaryLink(item), '_blank', 'noopener')
    const t = Date.now()
    setNow(t)
    onUpdate({ ...ride, phase: 'ride', startedAt: t, pausedAt: null, pausedMs: 0 })
  }

  const rateNow = () => {
    onUpdate({ ...ride, phase: 'ride' })
    setStep('note')
  }

  return (
    <section className="ride" aria-labelledby="ride-title">
      <header className="ride-head" style={{ '--c': item.line.color }}>
        <LineBadge line={item.line} size="lg" />
        <div>
          <h1 id="ride-title">{item.label}</h1>
          <p className="ride-meta">
            {review ? `${STAGE_TEXT[row?.stage] || 'Review'} • ` : ''}
            {item.line.name} • {item.section} • {kindText(item)}
          </p>
        </div>
        <button
          className="icon-btn"
          aria-label="Leave without saving"
          title="Leave without saving"
          onClick={() => (elapsed < 60000 && phase === 'ride' ? onExit() : setLeaving(true))}
        >
          <X size={20} />
        </button>
      </header>

      {leaving && (
        <div className="leave-bar" role="alert">
          <p>Leave this ride? The timer and anything you typed are lost.</p>
          <div>
            <button className="btn btn-quiet" onClick={() => setLeaving(false)}>
              Keep riding
            </button>
            <button className="btn btn-danger" onClick={onExit}>
              Leave
            </button>
          </div>
        </div>
      )}

      {phase === 'recall' ? (
        <Recall last={last} onStart={startSolving} onRateNow={rateNow} />
      ) : (
        <>
          <LinkSet item={item} />

          {item.lesson ? (
            <LessonDone item={item} actions={actions} run={run} say={say} onExit={onExit} minutes={Math.round(minutes)} />
          ) : step === 'ride' ? (
            <>
              <Track minutes={minutes} color={item.line.color} />
              <div className={paused ? 'ride-now paused' : 'ride-now'}>
                <div className="ride-clock">
                  <span className="ride-time mono" aria-live="off">
                    {mmss(elapsed)}
                  </span>
                  <button className="btn btn-quiet btn-pause" onClick={togglePause} aria-pressed={paused}>
                    {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
                    {paused ? 'Resume' : 'Pause'}
                  </button>
                </div>
                <p className="ride-tip">
                  {paused ? (
                    <>
                      <strong>Paused.</strong> The clock waits for you. Resume when you are back.
                    </>
                  ) : (
                    <>
                      <strong>{stop.name}.</strong> {stop.tip}
                    </>
                  )}
                </p>
              </div>
              <button className="btn btn-go btn-wide" onClick={() => setStep('note')}>
                {review ? 'I finished the review' : 'I finished it'}
              </button>
            </>
          ) : (
            <NoteForm
              item={item}
              row={row}
              review={review}
              last={last}
              minutes={Math.max(1, Math.round(minutes))}
              actions={actions}
              run={run}
              say={say}
              draft={draft}
              onBack={(d) => {
                setDraft(d)
                setStep('ride')
              }}
              onSaved={onExit}
            />
          )}
        </>
      )}
    </section>
  )
}

// Step 1 of a review: pull the idea out of memory before seeing anything.
function Recall({ last, onStart, onRateNow }) {
  const [text, setText] = useState('')
  const [shown, setShown] = useState(false)
  return (
    <div className="recall">
      <div className="recall-ask">
        <h2>From memory first</h2>
        <p>
          Before you open the problem: what is the idea, and what are the time and space complexity? Write it here or
          say it out loud. Then check it against your note.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Key idea, approach, complexity…"
          aria-label="What you remember"
        />
      </div>

      {shown ? (
        <div className="recall-note">
          <h3>Your note from last time</h3>
          {last ? <NoteView note={last} /> : <p className="muted">You saved no note last time.</p>}
        </div>
      ) : (
        <button className="btn btn-line btn-wide" onClick={() => setShown(true)} disabled={last === undefined}>
          {last === undefined ? 'Loading your note…' : 'Reveal my note'}
        </button>
      )}

      {shown && (
        <div className="recall-go">
          <button className="btn btn-go btn-wide" onClick={onStart}>
            Open the problem and start the timer <ExternalLink size={15} aria-hidden="true" />
          </button>
          <button className="btn btn-quiet" onClick={onRateNow}>
            Skip solving, rate it now
          </button>
        </div>
      )}
    </div>
  )
}

function Track({ minutes, color }) {
  // A narrower drawing on phones keeps the stop labels readable after scaling.
  const W = typeof window !== 'undefined' && window.innerWidth < 600 ? 620 : 1000
  const x = (m) => 40 + (Math.min(m, LINE_END) / LINE_END) * (W - 80)
  const pos = x(minutes)
  return (
    <figure className="track" style={{ '--c': color }}>
      <svg viewBox={`0 0 ${W} 120`} role="img" aria-label={`${Math.floor(minutes)} minutes on the solving line`}>
        <line className="track-rail" x1={x(0)} x2={x(LINE_END)} y1="60" y2="60" />
        <line className="track-done" x1={x(0)} x2={pos} y1="60" y2="60" />
        {STOPS.map((s) => (
          <g key={s.at} className={minutes >= s.at ? 'stop passed' : 'stop'}>
            <circle cx={x(s.at)} cy="60" r="13" />
            <text x={x(s.at)} y="28" textAnchor="middle">
              {s.at === 0 ? '' : s.name}
            </text>
            <text x={x(s.at)} y="104" textAnchor="middle" className="stop-min">
              {s.at}′
            </text>
          </g>
        ))}
        <g className="stop end">
          <rect x={x(LINE_END) - 8} y="44" width="16" height="32" rx="4" />
          <text x={x(LINE_END)} y="28" textAnchor="middle">
            Code
          </text>
        </g>
        <circle className="train" cx={pos} cy="60" r="8" />
      </svg>
    </figure>
  )
}

function LessonDone({ item, actions, run, say, onExit, minutes }) {
  const [busy, setBusy] = useState(false)
  const done = async () => {
    setBusy(true)
    const ok = await run(() => actions.finishNew(item, { result: 'alone', minutes }))
    if (!ok) return setBusy(false)
    say('Lesson done.')
    onExit()
  }
  return (
    <div className="lesson">
      <p>Watch or read the lesson, then mark it done. Lessons have no reviews.</p>
      <button className="btn btn-go btn-wide" onClick={done} disabled={busy}>
        {busy ? 'Saving…' : 'Mark lesson done'}
      </button>
    </div>
  )
}

const EMPTY = { pattern: '', time: '', space: '', key_idea: '', approach: '', mistake: '' }

// The note fields, filled from a saved note.
function fromNote(note) {
  if (!note) return EMPTY
  const { time, space } = splitComplexity(note.complexity)
  return {
    pattern: note.pattern || '',
    time,
    space,
    key_idea: note.key_idea || '',
    approach: note.approach || '',
    mistake: note.mistake || '',
  }
}

function NoteForm({ item, row, review, last, minutes, actions, run, say, draft, onBack, onSaved }) {
  const [result, setResult] = useState(draft?.result ?? null)
  // A review starts from your last note, so you edit it instead of retyping.
  const [f, setF] = useState(() => ({ ...(review ? fromNote(last) : EMPTY), ...draft?.f, minutes }))
  const touched = useRef(Boolean(draft))
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => {
    touched.current = true
    setF((s) => ({ ...s, [k]: e.target.value }))
  }

  // The last note may arrive after the form opens; fill it in if you have
  // not typed yet.
  useEffect(() => {
    if (!review || !last || touched.current) return
    setF((s) => ({ ...s, ...fromNote(last) }))
  }, [review, last])

  const save = async (e) => {
    e.preventDefault()
    if (!result) return
    setBusy(true)
    const complexity = [f.time.trim() && `T ${f.time.trim()}`, f.space.trim() && `S ${f.space.trim()}`].filter(Boolean).join(' • ')
    const note = {
      result,
      minutes: Math.max(0, Math.min(1440, Number(f.minutes) || 0)),
      pattern: f.pattern.trim().slice(0, 200) || null,
      key_idea: f.key_idea.trim().slice(0, 2000) || null,
      approach: f.approach.trim().slice(0, 8000) || null,
      mistake: f.mistake.trim().slice(0, 2000) || null,
      complexity: complexity.slice(0, 200) || null,
    }
    const ok = await run(() => (review ? actions.finishReview(item, row, note) : actions.finishNew(item, note)))
    if (!ok) return setBusy(false)
    const today = dayString()
    say(arrivalText(review ? afterReview(row, result, today) : afterNewSolve(item, today)))
    onSaved()
  }

  const results = review ? REVIEW_RESULTS : NEW_RESULTS

  return (
    <form className="note" onSubmit={save}>
      <fieldset className="choice">
        <legend>How did it go?</legend>
        {results.map(([value, label, hint]) => (
          <label key={value} className={result === value ? `chip on chip-${value}` : `chip chip-${value}`}>
            <input type="radio" name="result" value={value} checked={result === value} onChange={() => setResult(value)} />
            {label}
            {hint && <small>{hint}</small>}
          </label>
        ))}
      </fieldset>

      {review && last && <p className="field-hint">Your last note is filled in below. Change what you understand better now.</p>}

      <div className="field-row">
        <label className="field">
          <span>Your time complexity</span>
          <input value={f.time} onChange={set('time')} placeholder="O(n log n)" maxLength={60} />
        </label>
        <label className="field">
          <span>Your space complexity</span>
          <input value={f.space} onChange={set('space')} placeholder="O(1)" maxLength={60} />
        </label>
      </div>
      {!review && <p className="field-hint">Write these before you check the editorial. Then compare.</p>}

      <label className="field">
        <span>Pattern</span>
        <input value={f.pattern} onChange={set('pattern')} list="patterns" placeholder="Sliding window" maxLength={200} />
        <datalist id="patterns">
          {PATTERNS.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </label>
      <label className="field">
        <span>Key idea</span>
        <textarea
          value={f.key_idea}
          onChange={set('key_idea')}
          rows={3}
          maxLength={2000}
          placeholder="The one sentence that makes the solution click."
        />
      </label>
      <label className="field">
        <span>
          Approach or code <small>optional</small>
        </span>
        <textarea
          className="mono-input"
          value={f.approach}
          onChange={set('approach')}
          rows={6}
          maxLength={8000}
          spellCheck="false"
          placeholder={'Steps, edge cases, or the code itself.\n1. …\n2. …'}
        />
      </label>
      <label className="field">
        <span>Mistake</span>
        <textarea
          value={f.mistake}
          onChange={set('mistake')}
          rows={2}
          maxLength={2000}
          placeholder="Where you went wrong, so the next review catches it."
        />
      </label>
      <label className="field field-small">
        <span>Minutes</span>
        <input type="number" min="0" max="1440" value={f.minutes} onChange={set('minutes')} />
      </label>

      <div className="form-actions">
        <button type="button" className="btn btn-quiet" onClick={() => onBack({ result, f })}>
          Back to the timer
        </button>
        <button type="submit" className="btn btn-go" disabled={!result || busy}>
          {busy ? 'Saving…' : 'Save and arrive'}
        </button>
      </div>
    </form>
  )
}
