import { useEffect, useState } from 'react'
import { LogOut, Minus, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Settings({ user, state, actions, run }) {
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
        <p>New stations per week. Terminus spreads them over the days left. Reviews are extra, at most two a day.</p>
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

      <div className="setting">
        <h2>How the line runs</h2>
        <ul className="rules">
          <li>Today shows two lists: reviews that are due, and new stations from your budget.</li>
          <li>After you solve a problem, it comes back after 3, 7 and 21 days.</li>
          <li>A clean review moves it on. A struggled review starts the 3-day loop again.</li>
          <li>Missed a day? The work moves forward. No streaks, no guilt.</li>
          <li>&ldquo;I know this&rdquo; and Skip take a station off the board. Undo them from the map.</li>
        </ul>
      </div>

      <div className="setting">
        <h2>Account</h2>
        <p>
          Signed in as <strong>{user.email}</strong>. Your progress is private to this account.
        </p>
        <button className="btn btn-quiet" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} aria-hidden="true" /> Sign out
        </button>
      </div>
    </section>
  )
}
