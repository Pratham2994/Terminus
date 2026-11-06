import { useCallback, useEffect, useState } from 'react'
import { TrainFront, Map as MapIcon, BookOpen, Settings as Gear } from 'lucide-react'
import { configured, supabase } from './lib/supabase'
import { useTerminus } from './lib/store'
import { ITEM_BY_KEY } from './lib/sheet'
import SignIn from './screens/SignIn'
import Today from './screens/Today'
import Ride from './screens/Ride'
import MapView from './screens/MapView'
import Kit from './screens/Kit'
import Settings from './screens/Settings'
import StationSheet from './screens/StationSheet'

const TABS = [
  { id: 'today', label: 'Today', Icon: TrainFront },
  { id: 'map', label: 'Map', Icon: MapIcon },
  { id: 'kit', label: 'Kit', Icon: BookOpen },
]
const RIDE_KEY = 'terminus.ride'

function readHash() {
  const h = window.location.hash.replace('#', '')
  return ['today', 'map', 'kit', 'settings'].includes(h) ? h : 'today'
}

function readRide() {
  try {
    const ride = JSON.parse(localStorage.getItem(RIDE_KEY))
    return ride && ITEM_BY_KEY.has(ride.key) ? ride : null
  } catch {
    return null
  }
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!configured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!configured) {
    return (
      <main className="center-screen">
        <p className="notice">
          Supabase is not configured. Copy <code>.env.example</code> to <code>.env.local</code> and fill in the project URL
          and publishable key.
        </p>
      </main>
    )
  }
  if (session === undefined) return <main className="center-screen" aria-busy="true" />
  if (!session) return <SignIn />
  return <Shell user={session.user} />
}

function Shell({ user }) {
  const [tab, setTab] = useState(readHash)
  const [ride, setRideState] = useState(readRide)
  const [station, setStation] = useState(null)
  const [toast, setToast] = useState(null)
  const [state, actions] = useTerminus(user)

  useEffect(() => {
    const onHash = () => setTab(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const go = (id) => {
    window.location.hash = id
    setTab(id)
    window.scrollTo(0, 0)
  }

  const setRide = useCallback((r) => {
    try {
      if (r) localStorage.setItem(RIDE_KEY, JSON.stringify(r))
      else localStorage.removeItem(RIDE_KEY)
    } catch {
      /* storage blocked: the ride still works for this page load */
    }
    setRideState(r)
  }, [])

  // Runs an action and turns a failure into a toast instead of a crash.
  const run = useCallback(async (fn) => {
    try {
      await fn()
      return true
    } catch (e) {
      setToast(e.message || 'Something went wrong.')
      return false
    }
  }, [])

  const closeStation = useCallback(() => setStation(null), [])

  const board = (item, kind) => {
    setStation(null)
    setRide({ key: item.key, kind, startedAt: Date.now() })
    go('today')
  }

  let body
  if (state.loading) body = <p className="loading">Loading your line…</p>
  else if (state.error)
    body = (
      <div className="notice">
        <p>{state.error}</p>
        <button className="btn" onClick={actions.reload}>
          Try again
        </button>
      </div>
    )
  else if (ride && tab === 'today')
    body = <Ride ride={ride} state={state} actions={actions} run={run} onExit={() => setRide(null)} />
  else if (tab === 'today') body = <Today state={state} actions={actions} run={run} onBoard={board} />
  else if (tab === 'map') body = <MapView state={state} onStation={setStation} />
  else if (tab === 'kit') body = <Kit />
  else body = <Settings user={user} state={state} actions={actions} run={run} />

  return (
    <div className="shell">
      <header className="topbar">
        <a className="wordmark" href="#today" onClick={(e) => (e.preventDefault(), go('today'))}>
          <svg viewBox="0 0 40 16" aria-hidden="true">
            <path d="M2 8h30" />
            <circle cx="33" cy="8" r="5" />
          </svg>
          Terminus
        </a>
        <nav className="tabs" aria-label="Main">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className="tab" aria-current={tab === id ? 'page' : undefined} onClick={() => go(id)}>
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              <span>{label}</span>
              {id === 'today' && ride && <i className="ride-dot" aria-label="ride in progress" />}
            </button>
          ))}
        </nav>
        <button
          className="icon-btn"
          aria-label="Settings"
          aria-current={tab === 'settings' ? 'page' : undefined}
          onClick={() => go('settings')}
        >
          <Gear size={19} strokeWidth={2} />
        </button>
      </header>

      <main className="content">{body}</main>

      {station && (
        <StationSheet
          item={station}
          state={state}
          actions={actions}
          run={run}
          ride={ride}
          onBoard={board}
          onClose={closeStation}
        />
      )}

      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}
    </div>
  )
}
