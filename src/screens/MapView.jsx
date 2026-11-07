import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { SHEET } from '../lib/sheet'
import { lineStats, stationState } from '../lib/schedule'
import { LineBadge } from './bits'

const STATE_TEXT = {
  open: '',
  done: 'Solved',
  mastered: 'Mastered',
  due: 'Review due',
  known: 'Known',
  skipped: 'Skipped',
}

const FILTERS = [
  ['all', 'All'],
  ['open', 'Open'],
  ['due', 'Due'],
  ['solved', 'Solved'],
  ['known', 'Known'],
  ['skipped', 'Skipped'],
]
const PAGE = 40

function fits(filter, st) {
  if (filter === 'all') return true
  if (filter === 'solved') return st === 'done' || st === 'mastered' || st === 'due'
  return st === filter
}

// Lower case, no punctuation: "Two-Sum" and "two sum" match.
function norm(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const INDEX = SHEET.items.map((it) => ({
  item: it,
  text: norm(`${it.label} ${it.section} ${it.line.name} ${it.line.code} ${it.slug}`),
}))

// The open line and the search live in the shell, so the map comes back
// where you left it.
export default function MapView({ state, today, line: lineIndex, onLine: setLineIndex, search, onSearch, onStation }) {

  if (lineIndex !== null) {
    return (
      <LineDetail
        line={SHEET.lines[lineIndex]}
        state={state}
        today={today}
        onBack={() => setLineIndex(null)}
        onStation={onStation}
      />
    )
  }

  let doneAll = 0
  let totalAll = 0
  for (const line of SHEET.lines) {
    const s = lineStats(line, state.progress)
    doneAll += s.done
    totalAll += s.total
  }

  const searching = search.q.trim() !== '' || search.f !== 'all'

  return (
    <section className="network" aria-labelledby="map-title">
      <header className="page-head">
        <h1 id="map-title">Network</h1>
        <p>
          <span className="mono">
            {doneAll}/{totalAll}
          </span>{' '}
          stations reached. Search, or pick a line to see every stop.
        </p>
      </header>
      <Finder state={state} today={today} search={search} onSearch={onSearch} onStation={onStation} />
      {!searching && (
        <>
          <ol className="lines">
            {SHEET.lines.map((line) => (
              <LineRow key={line.code} line={line} state={state} today={today} onOpen={() => setLineIndex(line.index)} />
            ))}
          </ol>
          <Legend />
        </>
      )}
    </section>
  )
}

function Finder({ state, today, search, onSearch, onStation }) {
  const input = useRef(null)
  const [shown, setShown] = useState(PAGE)
  const { q, f } = search
  const searching = q.trim() !== '' || f !== 'all'

  // "/" jumps to the search box, as on most sites with search.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target
      if (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return
      e.preventDefault()
      input.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => setShown(PAGE), [q, f])

  const states = useMemo(
    () => new Map(SHEET.items.map((it) => [it.key, stationState(it, state.progress, today)])),
    [state.progress, today],
  )

  const counts = useMemo(() => {
    const c = {}
    for (const [id] of FILTERS) c[id] = 0
    for (const it of SHEET.items) for (const [id] of FILTERS) if (fits(id, states.get(it.key))) c[id]++
    return c
  }, [states])

  const results = useMemo(() => {
    if (!searching) return []
    const words = norm(q).split(' ').filter(Boolean)
    return INDEX.filter(({ item, text }) => fits(f, states.get(item.key)) && words.every((w) => text.includes(w))).map(
      ({ item }) => item,
    )
  }, [q, f, states, searching])

  const set = (patch) => onSearch({ ...search, ...patch })

  return (
    <div className="finder">
      <div className="search">
        <Search size={18} aria-hidden="true" />
        <input
          ref={input}
          type="search"
          value={q}
          onChange={(e) => set({ q: e.target.value })}
          onKeyDown={(e) => e.key === 'Escape' && set({ q: '' })}
          placeholder={`Search ${SHEET.items.length} stations`}
          aria-label="Search stations by name, section or line"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck="false"
        />
        {q ? (
          <button
            className="search-clear"
            aria-label="Clear search"
            onClick={() => {
              set({ q: '' })
              input.current?.focus()
            }}
          >
            <X size={16} />
          </button>
        ) : (
          <kbd className="search-key" aria-hidden="true">
            /
          </kbd>
        )}
      </div>
      <div className="chips" role="group" aria-label="Filter stations">
        {FILTERS.map(([id, label]) => (
          <button key={id} className="chip-f" aria-pressed={f === id} onClick={() => set({ f: id })}>
            {label}
            <span className="mono">{counts[id]}</span>
          </button>
        ))}
      </div>

      {searching && (
        <div className="results">
          <p className="results-count" aria-live="polite">
            {results.length === 0
              ? 'No stations match.'
              : `${results.length} ${results.length === 1 ? 'station' : 'stations'}`}
          </p>
          {results.length > 0 && (
            <ol className="result-list">
              {results.slice(0, shown).map((item) => {
                const st = states.get(item.key)
                return (
                  <li key={item.key} className={`result st-${st}`}>
                    <button onClick={() => onStation(item)} style={{ '--c': item.line.color }}>
                      <LineBadge line={item.line} />
                      <span className="result-main">
                        <span className="result-name">
                          {item.label}
                          {item.lesson && <span className="station-tag">lesson</span>}
                        </span>
                        <span className="result-sub">
                          {item.line.name} • {item.section}
                        </span>
                      </span>
                      {STATE_TEXT[st] && (
                        <span className="station-state">{item.lesson && st === 'mastered' ? 'Done' : STATE_TEXT[st]}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
          {results.length > shown && (
            <button className="btn btn-quiet btn-wide" onClick={() => setShown((n) => n + PAGE)}>
              Show {Math.min(PAGE, results.length - shown)} more
            </button>
          )}
        </div>
      )}
    </div>
  )
}


function LineRow({ line, state, today, onOpen }) {
  const { done, total } = lineStats(line, state.progress)
  const states = useMemo(() => line.items.map((it) => stationState(it, state.progress, today)), [line, state.progress, today])
  const due = states.filter((s) => s === 'due').length
  const n = line.items.length
  const w = 1000 / n
  return (
    <li>
      <button className="line-row" style={{ '--c': line.color }} onClick={onOpen}>
        <LineBadge line={line} />
        <span className="line-name">{line.name}</span>
        <span className="line-count mono">
          {done}/{total}
          {due > 0 && <em> • {due} due</em>}
        </span>
        <svg className="line-strip" viewBox="0 0 1000 16" preserveAspectRatio="none" aria-hidden="true">
          <rect className="strip-rail" x="0" y="6" width="1000" height="4" />
          {states.map((s, i) =>
            s === 'open' || s === 'skipped' ? null : (
              <rect key={i} className={`strip-${s}`} x={i * w} y={s === 'due' ? 2 : 5} width={w + 0.5} height={s === 'due' ? 12 : 6} />
            ),
          )}
        </svg>
        <ChevronRight className="line-go" size={18} aria-hidden="true" />
      </button>
    </li>
  )
}

function LineDetail({ line, state, today, onBack, onStation }) {
  const { done, total } = lineStats(line, state.progress)
  return (
    <section className="line-detail" style={{ '--c': line.color }} aria-labelledby="line-title">
      <button className="back" onClick={onBack}>
        <ChevronLeft size={18} aria-hidden="true" /> All lines
      </button>
      <header className="line-head">
        <LineBadge line={line} size="lg" />
        <div>
          <h1 id="line-title">{line.name}</h1>
          <p>
            <span className="mono">
              {done}/{total}
            </span>{' '}
            stations • {line.sections.length} {line.sections.length === 1 ? 'section' : 'sections'}
          </p>
        </div>
      </header>

      <div className="route">
        {line.sections.map((section) => (
          <div className="zone" key={section.name}>
            <h2 className="zone-name">{section.name}</h2>
            <ol className="stations">
              {section.items.map((item) => {
                const s = stationState(item, state.progress, today)
                return (
                  <li key={item.key} className={`station st-${s}`}>
                    <button onClick={() => onStation(item)}>
                      <span className="station-dot" aria-hidden="true" />
                      <span className="station-name">
                        {item.label}
                        {item.lesson && <span className="station-tag">lesson</span>}
                      </span>
                      {STATE_TEXT[s] && (
                        <span className="station-state">{item.lesson && s === 'mastered' ? 'Done' : STATE_TEXT[s]}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
        <p className="route-end">End of the {line.code} line</p>
      </div>
    </section>
  )
}

function Legend() {
  return (
    <dl className="legend">
      <div>
        <dt>
          <span className="lg lg-open" />
        </dt>
        <dd>Not reached</dd>
      </div>
      <div>
        <dt>
          <span className="lg lg-done" />
        </dt>
        <dd>Solved, in review</dd>
      </div>
      <div>
        <dt>
          <span className="lg lg-due" />
        </dt>
        <dd>Review due</dd>
      </div>
      <div>
        <dt>
          <span className="lg lg-mastered" />
        </dt>
        <dd>Mastered or known</dd>
      </div>
    </dl>
  )
}
