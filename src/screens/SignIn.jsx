import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { SHEET } from '../lib/sheet'

export default function SignIn() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

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

  return (
    <main className="signin">
      <div className="signin-map" aria-hidden="true">
        {SHEET.lines.map((line, i) => (
          <span key={line.code} style={{ '--c': line.color, '--i': i, '--w': `${38 + ((i * 37) % 9) * 6}%` }} />
        ))}
      </div>
      <div className="signin-card">
        <h1>
          Terminus
          <svg viewBox="0 0 40 16" aria-hidden="true">
            <path d="M2 8h30" />
            <circle cx="33" cy="8" r="5" />
          </svg>
        </h1>
        <p className="signin-lede">
          Striver&rsquo;s A2Z sheet as a metro network. {SHEET.items.length} stations, 20 lines, a few stops a week, and
          reviews before you forget.
        </p>
        <button className="btn btn-go" onClick={signIn} disabled={busy}>
          {busy ? 'Opening Google…' : 'Sign in with Google'}
        </button>
        {error && (
          <p className="error" role="alert">
            Sign-in failed: {error}
          </p>
        )}
      </div>
    </main>
  )
}
