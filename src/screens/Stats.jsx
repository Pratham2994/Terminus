import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { computeStats, GRID_WEEKS } from '../lib/stats'
import { parseDay, prettyDay } from '../lib/dates'
import { reviewsPerDay } from '../lib/schedule'
import { LineBadge } from './bits'
import { WhoSwitch } from './Notes'

const DAY_NAMES = ['Mon', '', 'Wed', '', 'Fri', '', '']

function pct(n, d) {
  return d ? Math.round((n / d) * 100) : 0
}

function level(n) {
  if (!n) return 0
  if (n === 1) return 1
  if (n === 2) return 2
  if (n <= 4) return 3
  return 4
}

function sessions(n) {
  return `${n} ${n === 1 ? 'session' : 'sessions'}`
}

export default function Stats({ user, state, partners, today, onStation }) {
  const [who, setWho] = useState(user.id)
  const partner = partners.find((p) => p.id === who)
  // You, or a partner (read only: their stations do not open your sheet).
  const source = partner || state
  const s = useMemo(
    () => computeStats({ progress: source.progress, attempts: source.attempts, today }),
    [source.progress, source.attempts, today],
  )
  if (partner) onStation = null

  return (
    <section className="stats" aria-labelledby="stats-title">
      <header className="page-head">
        <h1 id="stats-title">Stats</h1>
        <p>
          {partner ? `${partner.name}’s ride so far.` : 'How far you have ridden, and how well it is sticking.'} Sessions
          cover the last 26 weeks.
        </p>
      </header>

      {partners.length > 0 && <WhoSwitch user={user} partners={partners} who={who} onWho={setWho} />}

      <div className="kpis">
        <Kpi label="Stations reached" value={s.reached} of={s.total} bar={pct(s.reached, s.total)} />
        <Kpi label="Mastered" value={s.mastered} note="three clean reviews, or a lesson" />
        <Kpi label="Reviews due" value={s.due} note={s.due === 0 ? 'nothing waiting' : s.due > reviewsPerDay(s.due) ? `${reviewsPerDay(s.due)} a day on the board` : 'on today’s board'} hot={s.due > 0} />
        <Kpi label="Active days" value={s.activeThisMonth} note="this month" />
      </div>

      <Activity s={s} />

      <div className="stats-pair">
        <Reviews s={s} />
        <Solving s={s} />
      </div>

      <div className="stats-pair">
        <Patterns s={s} />
        <Shaky s={s} onStation={onStation} />
      </div>

      <Lines s={s} />
    </section>
  )
}

function Kpi({ label, value, of, note, bar, hot }) {
  return (
    <div className={hot ? 'kpi kpi-hot' : 'kpi'}>
      <span className="kpi-label">{label}</span>
      <span className="kpi-value mono">
        {value}
        {of !== undefined && <small>/{of}</small>}
      </span>
      {bar !== undefined ? (
        <span className="kpi-bar" aria-hidden="true">
          {bar > 0 && <i style={{ width: `${bar}%` }} />}
        </span>
      ) : (
        <span className="kpi-note">{note}</span>
      )}
    </div>
  )
}

function Card({ title, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      <h2 className="card-title">{title}</h2>
      {children}
    </section>
  )
}

function Activity({ s }) {
  const [hover, setHover] = useState(null)
  const total = s.weeks.flat().reduce((a, d) => a + (d.n || 0), 0)

  // Month label above the first week of each month. The first column gets
  // one only when the next label is far enough away not to collide.
  const monthOf = (w) => parseDay(w[0].day).getMonth()
  const firstChange = s.weeks.findIndex((w, i) => i > 0 && monthOf(w) !== monthOf(s.weeks[i - 1]))
  const months = s.weeks.map((w, i) => {
    const starts = i === 0 ? firstChange === -1 || firstChange >= 3 : monthOf(w) !== monthOf(s.weeks[i - 1])
    return starts ? parseDay(w[0].day).toLocaleDateString(undefined, { month: 'short' }) : ''
  })

  const pick = (e) => {
    const day = e.target.closest('[data-day]')?.dataset.day
    if (!day) return
    const n = Number(e.target.closest('[data-day]').dataset.n)
    setHover({ day, n })
  }

  return (
    <Card title="Activity" className="activity">
      <p className="card-sub" aria-live="polite">
        {hover ? (
          <>
            <b>{prettyDay(hover.day)}</b> • {hover.n ? sessions(hover.n) : 'no sessions'}
          </>
        ) : (
          <>
            <b>{s.activeInGrid}</b> active {s.activeInGrid === 1 ? 'day' : 'days'} and <b>{total}</b>{' '}
            {total === 1 ? 'session' : 'sessions'} in the last {GRID_WEEKS} weeks
          </>
        )}
      </p>
      <div className="heat-wrap">
        <div className="heat-days" aria-hidden="true">
          {DAY_NAMES.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="heat-scroll">
          <div className="heat-months" aria-hidden="true" style={{ '--weeks': GRID_WEEKS }}>
            {months.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
          <div
            className="heat"
            style={{ '--weeks': GRID_WEEKS }}
            role="img"
            aria-label={`Activity grid: ${s.activeInGrid} active days in the last ${GRID_WEEKS} weeks.`}
            onMouseOver={pick}
            onClick={pick}
            onMouseLeave={() => setHover(null)}
          >
            {s.weeks.map((w) =>
              w.map((d) => (
                <i
                  key={d.day}
                  className={d.n === null ? 'cell future' : `cell l${level(d.n)}`}
                  data-day={d.n === null ? undefined : d.day}
                  data-n={d.n ?? undefined}
                  title={d.n === null ? undefined : `${prettyDay(d.day)}: ${d.n ? sessions(d.n) : 'no sessions'}`}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <div className="heat-legend" aria-hidden="true">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className={`cell l${l}`} />
        ))}
        More
      </div>
    </Card>
  )
}

function Reviews({ s }) {
  const { stages } = s
  const inLoop = stages[1] + stages[2] + stages[3] + stages[4]
  const parts = [
    { key: 1, label: 'Waiting for review 1', n: stages[1] },
    { key: 2, label: 'Waiting for review 2', n: stages[2] },
    { key: 3, label: 'Waiting for review 3', n: stages[3] },
    { key: 4, label: 'Mastered', n: stages[4] },
  ]
  return (
    <Card title="Reviews">
      {s.reviews === 0 && inLoop === 0 ? (
        <p className="card-empty">Solve a problem and its reviews show up here after 3 days.</p>
      ) : (
        <>
          <p className="big-number">
            <span className="mono">{s.reviews ? `${pct(s.results.clean, s.reviews)}%` : '—'}</span>
            <small>
              clean, over {s.reviews} {s.reviews === 1 ? 'review' : 'reviews'}
              {s.reviews > 0 && ` • ${s.results.struggled} struggled • ${s.results.forgot} forgot`}
            </small>
          </p>
          {inLoop > 0 && (
            <>
              <div className="stack" aria-hidden="true">
                {parts.map(
                  (p) => p.n > 0 && <i key={p.key} className={`stack-${p.key}`} style={{ flexGrow: p.n }} title={`${p.label}: ${p.n}`} />,
                )}
              </div>
              <ul className="stack-key">
                {parts.map((p) => (
                  <li key={p.key}>
                    <i className={`dot stack-${p.key}`} aria-hidden="true" />
                    {p.label}
                    <span className="mono">{p.n}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Card>
  )
}

function Solving({ s }) {
  const rows = [
    ['alone', 'Solved alone'],
    ['hint', 'Needed a hint'],
    ['solution', 'Needed the solution'],
  ]
  const max = Math.max(1, ...rows.map(([k]) => s.results[k]))
  const hours = Math.floor(s.minutes / 60)
  return (
    <Card title="How you solve">
      {s.firstSolves === 0 ? (
        <p className="card-empty">Your first solved problem fills this in.</p>
      ) : (
        <>
          <ul className="bars">
            {rows.map(([k, label]) => (
              <li key={k}>
                <span className="bar-label">{label}</span>
                <span className="bar-track" aria-hidden="true">
                  <i className={`bar-${k}`} style={{ width: `${(s.results[k] / max) * 100}%` }} />
                </span>
                <span className="bar-value mono">
                  {s.results[k]} <small>{pct(s.results[k], s.firstSolves)}%</small>
                </span>
              </li>
            ))}
          </ul>
          <p className="card-foot">
            {s.avgNewMinutes !== null && (
              <>
                <span className="mono">{s.avgNewMinutes} min</span> per new problem •{' '}
              </>
            )}
            <span className="mono">{hours ? `${hours} h ${s.minutes % 60} min` : `${s.minutes} min`}</span> on the line in 26 weeks
          </p>
        </>
      )}
    </Card>
  )
}

function Patterns({ s }) {
  const max = Math.max(1, ...s.topPatterns.map((p) => p.count))
  return (
    <Card title="Top patterns">
      {s.topPatterns.length === 0 ? (
        <p className="card-empty">Write a pattern in your notes after a solve. The ones you meet most show up here.</p>
      ) : (
        <ul className="bars">
          {s.topPatterns.map((p) => (
            <li key={p.name}>
              <span className="bar-label">{p.name}</span>
              <span className="bar-track" aria-hidden="true">
                <i className="bar-pattern" style={{ width: `${(p.count / max) * 100}%` }} />
              </span>
              <span className="bar-value mono">{p.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function Shaky({ s, onStation }) {
  return (
    <Card title="Shaky stations">
      {s.shaky.length === 0 ? (
        <p className="card-empty">No struggled reviews. Stations you struggle with show up here so you can look again.</p>
      ) : (
        <ul className="shaky">
          {s.shaky.map(({ item, count }) => (
            <li key={item.key}>
              <button onClick={() => onStation(item)} disabled={!onStation}>
                <LineBadge line={item.line} />
                <span className="shaky-name">
                  {item.label}
                  <small>{item.section}</small>
                </span>
                <span className="shaky-count mono">{count}×</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function Lines({ s }) {
  return (
    <Card title="Lines" className="lines-card">
      <ul className="line-bars">
        {s.lines.map(({ line, done, total }) => (
          <li key={line.code} style={{ '--c': line.color }}>
            <LineBadge line={line} />
            <span className="lb-name">{line.name}</span>
            <span className="lb-count mono">
              {done}/{total}
            </span>
            <span className="lb-track" aria-hidden="true">
              <i style={{ width: `${pct(done, total)}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
