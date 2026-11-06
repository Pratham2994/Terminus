import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SHEET } from '../lib/sheet'
import { lineStats, stationState } from '../lib/schedule'
import { dayString } from '../lib/dates'
import { LineBadge } from './bits'

const STATE_TEXT = {
  open: '',
  done: 'Solved',
  mastered: 'Mastered',
  due: 'Review due',
  known: 'Known',
  skipped: 'Skipped',
}

export default function MapView({ state, onStation }) {
  const [lineIndex, setLineIndex] = useState(null)
  const today = dayString()

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

  return (
    <section className="network" aria-labelledby="map-title">
      <header className="page-head">
        <h1 id="map-title">Network</h1>
        <p>
          <span className="mono">
            {doneAll}/{totalAll}
          </span>{' '}
          stations reached. Pick a line to see every stop.
        </p>
      </header>
      <ol className="lines">
        {SHEET.lines.map((line) => (
          <LineRow key={line.code} line={line} state={state} today={today} onOpen={() => setLineIndex(line.index)} />
        ))}
      </ol>
      <Legend />
    </section>
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
