import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { ITEM_BY_KEY, strivLink } from '../lib/sheet'
import { LineBadge, STAGE_TEXT, kindText } from './bits'

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
  ['struggled', 'Struggled', 'Review again in 3 days'],
]

function mmss(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function Ride({ ride, state, actions, run, onExit }) {
  const item = ITEM_BY_KEY.get(ride.key)
  const row = state.progress.get(item.key)
  const [now, setNow] = useState(Date.now())
  const [step, setStep] = useState('ride')

  useEffect(() => {
    if (step !== 'ride') return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [step])

  const elapsed = now - ride.startedAt
  const minutes = elapsed / 60000
  const stop = [...STOPS].reverse().find((s) => minutes >= s.at)
  // Use the station as it is now, not as it was when the ride began: it may
  // have been reset or solved on another device since.
  const review = row?.status === 'done' && !item.lesson

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
        <button className="icon-btn" aria-label="Leave without saving" title="Leave without saving" onClick={onExit}>
          <X size={20} />
        </button>
      </header>

      <a className="btn btn-line" href={strivLink(item)} target="_blank" rel="noopener noreferrer">
        Open on takeUforward <ExternalLink size={15} aria-hidden="true" />
      </a>

      {item.lesson ? (
        <LessonDone item={item} actions={actions} run={run} onExit={onExit} minutes={Math.round(minutes)} />
      ) : step === 'ride' ? (
        <>
          <Track minutes={minutes} color={item.line.color} />
          <div className="ride-now">
            <span className="ride-time mono" aria-live="off">
              {mmss(elapsed)}
            </span>
            <p className="ride-tip">
              <strong>{stop.name}.</strong> {stop.tip}
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
          minutes={Math.max(1, Math.round(minutes))}
          actions={actions}
          run={run}
          onBack={() => setStep('ride')}
          onSaved={onExit}
        />
      )}
    </section>
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

function LessonDone({ item, actions, run, onExit, minutes }) {
  const [busy, setBusy] = useState(false)
  const done = async () => {
    setBusy(true)
    const ok = await run(() => actions.finishNew(item, { result: 'alone', minutes }))
    setBusy(false)
    if (ok) onExit()
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

function NoteForm({ item, row, review, minutes, actions, run, onBack, onSaved }) {
  const [result, setResult] = useState(null)
  const [f, setF] = useState({ pattern: '', time: '', space: '', key_idea: '', mistake: '', minutes })
  const [busy, setBusy] = useState(false)
  const [last, setLast] = useState(null)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  useEffect(() => {
    if (!review) return
    let live = true
    actions
      .history(item)
      .then((list) => live && setLast(list.find((a) => a.key_idea || a.pattern || a.mistake) || null))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [review, item, actions])

  const save = async (e) => {
    e.preventDefault()
    if (!result) return
    setBusy(true)
    const complexity = [f.time && `T ${f.time}`, f.space && `S ${f.space}`].filter(Boolean).join(' • ')
    const note = {
      result,
      minutes: Math.max(0, Math.min(1440, Number(f.minutes) || 0)),
      pattern: f.pattern.trim().slice(0, 200) || null,
      key_idea: f.key_idea.trim().slice(0, 2000) || null,
      mistake: f.mistake.trim().slice(0, 2000) || null,
      complexity: complexity.slice(0, 200) || null,
    }
    const ok = await run(() => (review ? actions.finishReview(item, row, note) : actions.finishNew(item, note)))
    setBusy(false)
    if (ok) onSaved()
  }

  const results = review ? REVIEW_RESULTS : NEW_RESULTS

  return (
    <form className="note" onSubmit={save}>
      <fieldset className="choice">
        <legend>How did it go?</legend>
        {results.map(([value, label, hint]) => (
          <label key={value} className={result === value ? 'chip on' : 'chip'}>
            <input type="radio" name="result" value={value} checked={result === value} onChange={() => setResult(value)} />
            {label}
            {hint && <small>{hint}</small>}
          </label>
        ))}
      </fieldset>

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
      <p className="field-hint">Write these before you check the editorial. Then compare.</p>

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

      {last && (
        <aside className="last-note">
          <h3>Your note from last time</h3>
          {last.pattern && (
            <p>
              <b>Pattern</b> {last.pattern}
            </p>
          )}
          {last.key_idea && (
            <p>
              <b>Key idea</b> {last.key_idea}
            </p>
          )}
          {last.mistake && (
            <p>
              <b>Mistake</b> {last.mistake}
            </p>
          )}
          {last.complexity && (
            <p>
              <b>Complexity</b> {last.complexity}
            </p>
          )}
        </aside>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-quiet" onClick={onBack}>
          Back to the timer
        </button>
        <button type="submit" className="btn btn-go" disabled={!result || busy}>
          {busy ? 'Saving…' : 'Save and arrive'}
        </button>
      </div>
    </form>
  )
}
