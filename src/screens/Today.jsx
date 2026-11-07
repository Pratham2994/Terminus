import { useMemo, useState } from 'react'
import { ArrowRight, Brain, Check, ExternalLink } from 'lucide-react'
import { planToday, projection } from '../lib/schedule'
import { strivLink } from '../lib/sheet'
import { agoText, dayString, prettyDay } from '../lib/dates'
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

function monthYear(day) {
  return new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
}

// When the sheet ends at this pace, and how that compares to your goal.
function PaceLine({ progress, budget, finishBy, today }) {
  const p = projection({ progress, budget, finishBy, today })
  if (p.remaining === 0) return null
  if (finishBy && p.late) return <p className="pace pace-behind">Your goal date has passed. Set a new one in Settings.</p>
  if (finishBy && p.need !== null) {
    return p.onPace ? (
      <p className="pace pace-ok">
        On pace to finish by {prettyDay(finishBy)}. {p.remaining} stations to go.
      </p>
    ) : (
      <p className="pace pace-behind">
        Behind your goal: {prettyDay(finishBy)} needs {p.need} a week. Change it in Settings.
      </p>
    )
  }
  return (
    <p className="pace">
      At {budget} a week you finish around {monthYear(p.finishAt)}. {p.remaining} stations to go.
    </p>
  )
}

// A small card per partner: their week, and whether they rode today.
function PartnerCard({ partner, today }) {
  const plan = useMemo(
    () => planToday({ progress: partner.progress, attempts: partner.attempts, budget: partner.budget, today }),
    [partner, today],
  )
  const rodeToday = partner.attempts.some(
    (a) => dayString(new Date(a.created_at)) === today && partner.progress.get(a.item_key)?.status === 'done',
  )
  const due = plan.redo.length + plan.redoWaiting
  return (
    <div className="partner-card">
      <WeekRing done={plan.doneThisWeek} budget={plan.budget} />
      <div>
        <strong>{partner.name.split(' ')[0]}</strong>
        <span>
          {plan.doneThisWeek}/{plan.budget} this week • {rodeToday ? 'rode today' : 'not yet today'}
          {due > 0 && ` • ${due} ${due === 1 ? 'review' : 'reviews'} left`}
        </span>
      </div>
    </div>
  )
}

export default function Today({ state, actions, run, say, onBoard, today, extra, onMore, redoExtra, onMoreReview, partners }) {
  const [busyKey, setBusyKey] = useState(null)
  const plan = useMemo(
    () => planToday({ progress: state.progress, attempts: state.attempts, budget: state.budget, extra, redoExtra, today }),
    [state.progress, state.attempts, state.budget, extra, redoExtra, today],
  )

  // A new station opens its page now. A review starts with recall, so its
  // page opens later, from the Ride screen.
  const start = (item, kind) => {
    if (kind === 'new') window.open(strivLink(item), '_blank', 'noopener')
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
      <PaceLine progress={state.progress} budget={state.budget} finishBy={state.settings?.finish_by} today={today} />

      {partners.length > 0 && (
        <div className="partners">
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} today={today} />
          ))}
        </div>
      )}

      <div className="platforms">
        <div className="platform">
          <h2 className="platform-title">
            Redo <span>reviews due</span>
          </h2>
          {plan.redo.length === 0 ? (
            <p className="board-empty">
              {plan.reviewedToday > 0 ? 'Today’s reviews are done.' : 'No reviews due. Your memory is holding.'}
            </p>
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
                      <Brain size={15} aria-hidden="true" /> Review
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {plan.redoWaiting > 0 && (
            <button className="next-up" onClick={onMoreReview}>
              <span>
                {plan.redoWaiting} more {plan.redoWaiting === 1 ? 'review waits' : 'reviews wait'}.{' '}
                <strong>Review one more</strong>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
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
