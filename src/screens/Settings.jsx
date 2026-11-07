import { useEffect, useState } from 'react'
import { Copy, LogOut, Minus, Plus, UserMinus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { projection } from '../lib/schedule'
import { addDays, dayString, prettyDay } from '../lib/dates'

export default function Settings({ user, state, actions, run, say, partners, onPartners }) {
  const [budget, setBudget] = useState(state.budget)
  const [saved, setSaved] = useState(false)
  const dirty = budget !== state.budget

  // A change saved on the other device arrives on refresh. Show it, unless
  // you are in the middle of changing the number here.
  const [seen, setSeen] = useState(state.budget)
  useEffect(() => {
    if (state.budget === seen) return
    setSeen(state.budget)
    if (budget === seen) setBudget(state.budget)
  }, [state.budget, seen, budget])

  const save = async () => {
    const ok = await run(() => actions.setBudget(budget))
    if (ok) setSaved(true)
  }
  const change = (n) => {
    setSaved(false)
    setBudget((b) => Math.max(1, Math.min(50, b + n)))
  }

  return (
    <section className="settings" aria-labelledby="settings-title">
      <header className="page-head">
        <h1 id="settings-title">Settings</h1>
      </header>

      <div className="setting">
        <h2>Weekly budget</h2>
        <p>New stations per week. Terminus spreads them over the days left. Reviews come on top: two a day, more when a backlog builds up.</p>
        <div className="stepper">
          <button className="icon-btn" aria-label="One fewer" onClick={() => change(-1)} disabled={budget <= 1}>
            <Minus size={18} />
          </button>
          <output className="mono" aria-live="polite">
            {budget}
          </output>
          <button className="icon-btn" aria-label="One more" onClick={() => change(1)} disabled={budget >= 50}>
            <Plus size={18} />
          </button>
          <button className="btn btn-go" onClick={save} disabled={!dirty}>
            Save
          </button>
          {saved && !dirty && <span className="muted">Saved.</span>}
        </div>
      </div>

      <Goal state={state} actions={actions} run={run} say={say} onBudget={(n) => setBudget(n)} />

      <Partner user={user} actions={actions} run={run} say={say} partners={partners} onPartners={onPartners} />

      <Emails user={user} state={state} actions={actions} run={run} />

      <div className="setting">
        <h2>How the line runs</h2>
        <ul className="rules">
          <li>Today shows two lists: reviews that are due, and new stations from your budget.</li>
          <li>After you solve a problem, it comes back after 3, 7 and 21 days.</li>
          <li>A review starts from memory: recall the idea, then check your note, then solve it again.</li>
          <li>Clean moves it on. Struggled starts the 3-day loop again. Forgot brings it back tomorrow.</li>
          <li>Missed a day? The work moves forward. No streaks, no guilt.</li>
          <li>&ldquo;I know this&rdquo; and Skip take a station off the board. Undo them from the map.</li>
        </ul>
      </div>

      <div className="setting">
        <h2>Account</h2>
        <p>
          Signed in as <strong>{user.email}</strong>. Only you{partners.length > 0 ? ' and your partner' : ''} can see your
          progress and notes.
        </p>
        <button className="btn btn-quiet" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} aria-hidden="true" /> Sign out
        </button>
      </div>
    </section>
  )
}

function Goal({ state, actions, run, say, onBudget }) {
  const today = dayString()
  const current = state.settings?.finish_by || ''
  const [date, setDate] = useState(current)
  useEffect(() => setDate(current), [current])
  const p = projection({ progress: state.progress, budget: state.budget, finishBy: date || null, today })

  const saveDate = async (value) => {
    setDate(value)
    const ok = await run(() => actions.setSettings({ finish_by: value || null }))
    if (ok) say(value ? `Goal set: finish by ${prettyDay(value)}.` : 'Goal removed.')
  }

  const useNeed = async () => {
    const n = Math.min(50, p.need)
    const ok = await run(() => actions.setBudget(n))
    if (ok) {
      onBudget(n)
      say(`Budget set to ${n} a week.`)
    }
  }

  return (
    <div className="setting">
      <h2>Finish by</h2>
      <p>Optional. Pick a date and Terminus tells you the weekly pace it needs.</p>
      <div className="goal-row">
        <input
          type="date"
          className="date-input"
          value={date}
          min={addDays(today, 7)}
          onChange={(e) => saveDate(e.target.value)}
          aria-label="Finish the sheet by"
        />
        {date && (
          <button className="btn btn-quiet" onClick={() => saveDate('')}>
            Remove goal
          </button>
        )}
      </div>
      {p.remaining > 0 && (
        <p className="goal-out">
          {date && p.need !== null ? (
            <>
              {p.remaining} stations left. To finish by {prettyDay(date)} you need <strong>{p.need} a week</strong>
              {p.need > 50 ? ', more than the maximum of 50. Pick a later date.' : '.'}
              {p.need <= 50 && p.need !== state.budget && (
                <button className="btn btn-line btn-inline" onClick={useNeed}>
                  Use {p.need} a week
                </button>
              )}
              {p.need === state.budget && ' Your budget already matches.'}
            </>
          ) : (
            <>
              {p.remaining} stations left. At {state.budget} a week you finish around {p.finishAt ? prettyDay(p.finishAt) : '—'}.
            </>
          )}
        </p>
      )}
    </div>
  )
}

function Partner({ user, actions, run, say, partners, onPartners }) {
  const [code, setCode] = useState(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const make = async () => {
    setBusy(true)
    let c = null
    const ok = await run(async () => {
      c = await actions.createInvite()
    })
    setBusy(false)
    if (ok) setCode(c)
  }

  const join = async (e) => {
    e.preventDefault()
    setBusy(true)
    const ok = await run(() => actions.acceptInvite(input))
    setBusy(false)
    if (ok) {
      setInput('')
      await onPartners()
      say('Linked. You can now see each other’s progress.')
    }
  }

  const remove = async (p) => {
    const ok = await run(() => actions.removePartner(p.id))
    if (ok) {
      await onPartners()
      say(`Unlinked from ${p.name}.`)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      say('Code copied.')
    } catch {
      /* the code is on screen; copying is a convenience */
    }
  }

  return (
    <div className="setting">
      <h2>Partner</h2>
      <p>
        Link with one person to ride together. You both see each other’s week, stats and notes on Today, Stats and Notes.
        Neither of you can change the other’s data.
      </p>

      {partners.length > 0 && (
        <ul className="partner-list">
          {partners.map((p) => (
            <li key={p.id}>
              <span>
                Linked with <strong>{p.name}</strong>
              </span>
              <button className="btn btn-quiet" onClick={() => remove(p)}>
                <UserMinus size={16} aria-hidden="true" /> Unlink
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="invite">
        <div>
          <h3>Invite</h3>
          {code ? (
            <p className="invite-code">
              <span className="mono">{code}</span>
              <button className="icon-btn" aria-label="Copy the code" onClick={copy}>
                <Copy size={17} />
              </button>
            </p>
          ) : (
            <button className="btn btn-line" onClick={make} disabled={busy}>
              Make an invite code
            </button>
          )}
          <p className="muted small">
            {code ? 'Send this code to your partner. It works once, for 7 days.' : 'Your partner types the code on their Settings page.'}
          </p>
        </div>
        <form onSubmit={join}>
          <h3>Have a code?</h3>
          <div className="join">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              placeholder="ABC234"
              aria-label="Invite code"
              className="mono"
              autoComplete="off"
              spellCheck="false"
            />
            <button className="btn btn-go" disabled={input.length !== 6 || busy}>
              Link
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EMAILS = [
  ['email_morning', 'Morning board', 'At 8:00: today’s reviews and new stations.'],
  ['email_evening', 'Evening nudge', 'At 21:00, only on a day you did nothing.'],
  ['email_weekly', 'Weekly summary', 'Sunday at 19:00: your week, and your partner’s.'],
]

function Emails({ user, state, actions, run }) {
  const s = state.settings || {}
  const toggle = (key) => run(() => actions.setSettings({ [key]: !(s[key] ?? true) }))
  return (
    <div className="setting">
      <h2>Emails</h2>
      <p>
        Sent to <strong>{user.email}</strong>, at your local time ({s.timezone || 'your time zone'}).
      </p>
      <ul className="switches">
        {EMAILS.map(([key, label, hint]) => (
          <li key={key}>
            <label className="switch">
              <input type="checkbox" checked={s[key] ?? true} onChange={() => toggle(key)} />
              <span className="switch-ui" aria-hidden="true" />
              <span className="switch-text">
                <strong>{label}</strong>
                <small>{hint}</small>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
