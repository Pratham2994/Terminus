import { useEffect, useState } from 'react'
import { ITEM_BY_KEY, SHEET } from '../lib/sheet'
import { supabase } from '../lib/supabase'
import { LineBadge } from './bits'

// Stations for the sample board. Real A2Z items, picked from three lines.
const SAMPLE = [
  { key: 'longest-consecutive-sequence-in-an-array', sub: 'Review 2 of 3 • seen 7 days ago', redo: true },
  { key: 'search-in-rotated-sorted-array-i' },
  { key: 'detect-a-loop-in-ll' },
]
  .filter((r) => ITEM_BY_KEY.has(r.key))
  .map((r) => {
    const item = ITEM_BY_KEY.get(r.key)
    return { ...r, item, sub: r.sub || `${item.section} • ${item.minutes} min video` }
  })

const STEPS = [
  {
    code: 'ARR',
    title: 'Board',
    text: 'Each day shows two lists: reviews that are due, and new stations from your weekly budget. Miss a day and the work moves forward.',
  },
  {
    code: 'BIN',
    title: 'Ride',
    text: 'Start opens the problem on takeUforward and a timer with stops: plan by 5 minutes, half the video at 22, the solution at 40.',
  },
  {
    code: 'DP',
    title: 'Review',
    text: 'Log your complexity, pattern and mistake. The station comes back after 3, 7 and 21 days until it sticks.',
  },
]

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function SignIn() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const clock = useClock()
  const lineByCode = new Map(SHEET.lines.map((l) => [l.code, l]))

  const signIn = async () => {
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      setError(error.message)
      setBusy(false)
    }
  }

  const button = (
    <button className="btn btn-go btn-cta" onClick={signIn} disabled={busy}>
      <GoogleMark />
      {busy ? 'Opening Google…' : 'Sign in with Google'}
    </button>
  )

  return (
    <div className="landing">
      <div className="landing-lines" aria-hidden="true">
        {SHEET.lines.map((line, i) => (
          <span key={line.code} style={{ '--c': line.color, '--i': i, '--w': `${30 + ((i * 37) % 9) * 7}%` }} />
        ))}
      </div>

      <header className="landing-bar">
        <span className="wordmark">
          <svg viewBox="0 0 40 16" aria-hidden="true">
            <path d="M2 8h30" />
            <circle cx="33" cy="8" r="5" />
          </svg>
          Terminus
        </span>
        <button className="btn btn-quiet" onClick={signIn} disabled={busy}>
          Sign in
        </button>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              Finish the A2Z sheet <em>this time.</em>
            </h1>
            <p className="hero-lede">
              Terminus turns Striver&rsquo;s {SHEET.items.length} problems into a metro network. A few stations a week,
              reviews before you forget, and one board that tells you what to do today.
            </p>
            <div className="hero-cta">
              {button}
              <p className="hero-note">Free. Your progress is private to your Google account.</p>
            </div>
            {error && (
              <p className="error" role="alert">
                Sign-in failed: {error}
              </p>
            )}
          </div>

          <figure className="preview" aria-label="A sample departures board">
            <div className="preview-head">
              <span>Departures</span>
              <time className="mono">{clock}</time>
            </div>
            <ol className="preview-rows">
              {SAMPLE.map((r, i) => (
                <li key={r.key} style={{ '--i': i }}>
                  <LineBadge line={r.item.line} />
                  <span className="pv-main">
                    <span className="pv-name">{r.item.label}</span>
                    <span className="pv-sub">{r.sub}</span>
                  </span>
                  <span className={r.redo ? 'pv-tag pv-redo' : 'pv-tag'}>{r.redo ? 'Redo' : 'New'}</span>
                </li>
              ))}
            </ol>
            <figcaption className="preview-foot">
              <span className="mono">2/4</span> new this week • 3 days left
            </figcaption>
          </figure>
        </section>

        <section className="steps" aria-labelledby="steps-title">
          <h2 id="steps-title">One line, three stops</h2>
          <ol className="step-line">
            {STEPS.map((s, i) => {
              const line = lineByCode.get(s.code)
              return (
                <li key={s.title} style={{ '--c': line.color }}>
                  <span className="step-stop" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="network-strip" aria-labelledby="net-title">
          <h2 id="net-title">
            {SHEET.lines.length} lines. {SHEET.items.length} stations.
          </h2>
          <p>Every topic in Striver&rsquo;s exact order, from basics to tries and graphs. Search it, filter it, and see how far you have ridden.</p>
          <ul className="badge-cloud">
            {SHEET.lines.map((line) => (
              <li key={line.code} style={{ '--c': line.color }}>
                <LineBadge line={line} />
                <span>{line.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="final-cta">
          <h2>Your next train leaves today.</h2>
          {button}
        </section>
      </main>

      <footer className="landing-foot">
        Terminus links to takeUforward for every problem and copies none of its content.
      </footer>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg className="g-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c1-2.9 3.6-4.9 6.7-4.9Z" />
    </svg>
  )
}
