import { useMemo, useState } from 'react'
import { ArrowRight, Check, ExternalLink } from 'lucide-react'
import { planToday } from '../lib/schedule'
import { strivLink } from '../lib/sheet'
import { agoText, prettyDay } from '../lib/dates'
import { Clock, LineBadge, STAGE_TEXT, kindText } from './bits'

// A small ring that fills as the week's budget is used.
function WeekRing({ done, budget }) {
  const r = 15
  const c = 2 * Math.PI * r
  const part = Math.min(1, budget ? done / budget : 0)
  return (
    <svg className={part >= 1 ? 'week-ring full' : 'week-ring'} viewBox="0 0 40 40" aria-hidden="true">
      <circle className="wr-rail" cx="20" cy="20" r={r} />
      <circle className="wr-fill" cx="20" cy="20" r={r} strokeDasharray={`${part * c} ${c}`} />
    </svg>
  )
}

export default function Today({ state, actions, run, say, onBoard, today, extra, onMore }) {
  const [busyKey, setBusyKey] = useState(null)
  const plan = useMemo(
    () => planToday({ progress: state.progress, attempts: state.attempts, budget: state.budget, extra, today }),
    [state.progress, state.attempts, state.budget, extra, today],
  )

  const start = (item, kind) => {
    window.open(strivLink(item), '_blank', 'noopener')
    onBoard(item, kind)
  }

  const weekLeft = Math.max(0, plan.budget - plan.doneThisWeek)

  return (
    <section className="board" aria-labelledby="board-title">
      <header className="board-head">
        <div>
          <h1 id="board-title">Departures</h1>
          <p className="board-date">{prettyDay(today)}</p>
        </div>
        <Clock />
      </header>

      <p className="board-week">
        <WeekRing done={plan.doneThisWeek} budget={plan.budget} />
        <span className="mono">
          {plan.doneThisWeek}/{plan.budget}
        </span>{' '}
        new this week
        {weekLeft > 0 ? (
          <>
            {' '}
            • {plan.daysLeft} {plan.daysLeft === 1 ? 'day' : 'days'} left
          </>
        ) : (
          ' • week done'
        )}
      </p>

      <div className="platforms">
        <div className="platform">
          <h2 className="platform-title">
            Redo <span>reviews due</span>
          </h2>
          {plan.redo.length === 0 ? (
            <p className="board-empty">No reviews due. Your memory is holding.</p>
          ) : (
            <ol className="rows">
              {plan.redo.map(({ item, row, ago, late }, i) => (
                <li className="row" key={item.key} style={{ '--i': i }}>
                  <LineBadge line={item.line} />
                  <div className="row-main">
                    <span className="row-name">{item.label}</span>
                    <span className="row-sub">
                      {STAGE_TEXT[row.stage] || 'Review'} • seen {agoText(ago)}
                      {late > 0 && <em> • {late}d late</em>}
                    </span>
                  </div>
                  <div className="row-actions">
                    <button className="btn btn-go" onClick={() => start(item, 'review')}>
                      Start <ExternalLink size={15} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {plan.redoWaiting > 0 && (
            <p className="board-note">
              {plan.redoWaiting} more {plan.redoWaiting === 1 ? 'review waits' : 'reviews wait'} for the next days. Two a
              day is enough.
            </p>
          )}
        </div>

        <div className="platform">
          <h2 className="platform-title">
            Today <span>new stations</span>
          </h2>
          {plan.finishedSheet ? (
            <p className="board-empty">You reached the terminus. Every station on A2Z is done.</p>
          ) : plan.fresh.length === 0 ? (
            <p className="board-empty">
              {weekLeft === 0 ? 'This week’s budget is done. Rest, or ride one more.' : 'Nothing new today. Done for now.'}
            </p>
          ) : (
            <ol className="rows">
              {plan.fresh.map((item, i) => (
                <li className="row" key={item.key} style={{ '--i': i + plan.redo.length }}>
                  <LineBadge line={item.line} />
                  <div className="row-main">
                    <span className="row-name">{item.label}</span>
                    <span className="row-sub">
                      {item.section} • {kindText(item)}
                    </span>
                  </div>
                  <div className="row-actions">
                    <button className="btn btn-go" onClick={() => start(item, 'new')}>
                      Start <ExternalLink size={15} aria-hidden="true" />
                    </button>
                    <button
                      className="btn btn-quiet"
                      title="Skip it with no reviews. You can undo this on the map."
                      disabled={busyKey === item.key}
                      onClick={async () => {
                        setBusyKey(item.key)
                        const ok = await run(() => actions.mark(item, 'known'))
                        setBusyKey(null)
                        if (ok) say(`${item.label} marked as known.`, () => actions.restore(item, null))
                      }}
                    >
                      <Check size={15} aria-hidden="true" /> I know this
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {plan.nextUp && (
            <button className="next-up" onClick={onMore}>
              <span>
                Ride one more: <strong>{plan.nextUp.label}</strong>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
