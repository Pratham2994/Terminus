import { useCallback, useEffect, useState } from 'react'
import { TrainFront, Map as MapIcon, BookOpen, ChartColumn, NotebookPen, Settings as Gear } from 'lucide-react'
import { configured, supabase } from './lib/supabase'
import { useTerminus } from './lib/store'
import { usePartners } from './lib/partners'
import { ITEM_BY_KEY } from './lib/sheet'
import { dayString } from './lib/dates'
import SignIn from './screens/SignIn'
import Today from './screens/Today'
import Ride from './screens/Ride'
import MapView from './screens/MapView'
import Kit from './screens/Kit'
import Stats from './screens/Stats'
import Notes from './screens/Notes'
import Editorial from './screens/Editorial'
import Settings from './screens/Settings'
import StationSheet from './screens/StationSheet'

const TABS = [
  { id: 'today', label: 'Today', Icon: TrainFront },
  { id: 'map', label: 'Map', Icon: MapIcon },
  { id: 'notes', label: 'Notes', Icon: NotebookPen },
  { id: 'stats', label: 'Stats', Icon: ChartColumn },
  { id: 'kit', label: 'Kit', Icon: BookOpen },
]
const RIDE_KEY = 'terminus.ride'
const EXTRA_KEY = 'terminus.extra'
const REDO_EXTRA_KEY = 'terminus.redoExtra'

function readHash() {
  const h = window.location.hash.replace('#', '')
  if (h.startsWith('editorial/')) return 'editorial'
  return ['today', 'map', 'notes', 'stats', 'kit', 'settings'].includes(h) ? h : 'today'
}

// The station key in "#editorial/<key>".
function readEditorialKey() {
  const h = window.location.hash.replace('#', '')
  return h.startsWith('editorial/') ? decodeURIComponent(h.slice('editorial/'.length)) : null
}

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function writeJSON(key, value) {
  try {
    if (value) localStorage.setItem(key, JSON.stringify(value))
    else localStorage.removeItem(key)
  } catch {
    /* storage blocked: the value still works for this page load */
  }
}

// A ride belongs to one account. A ride left by another account is ignored.
function readRide(uid) {
  const ride = readJSON(RIDE_KEY)
  // Rides saved before this check have no uid; keep them.
  return ride && (!ride.uid || ride.uid === uid) && ITEM_BY_KEY.has(ride.key) ? ride : null
}

// A "one more" counter for today, kept across rides and reloads. A new day
// starts again at zero.
function useDayCount(key, uid, today) {
  const [saved, setSaved] = useState(() => readJSON(key))
  const n = saved?.uid === uid && saved?.day === today ? saved.n : 0
  const add = useCallback(() => {
    const next = { uid, day: today, n: n + 1 }
    writeJSON(key, next)
    setSaved(next)
  }, [key, uid, today, n])
  return [n, add]
}

// The local day, kept current while the app stays open past midnight.
function useToday() {
  const [today, setToday] = useState(dayString)
  useEffect(() => {
    const tick = () => setToday(dayString())
    const t = setInterval(tick, 60000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])
  return today
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
  const [edKey, setEdKey] = useState(readEditorialKey)
  // Where Back on an editorial returns to.
  const [edFrom, setEdFrom] = useState(null)
  const [ride, setRideState] = useState(() => readRide(user.id))
  const [station, setStation] = useState(null)
  const [mapLine, setMapLine] = useState(null)
  const [mapSearch, setMapSearch] = useState({ q: '', f: 'all' })
  const [toast, setToast] = useState(null)
  const [state, actions] = useTerminus(user)
  const today = useToday()
  const [{ partners }, reloadPartners] = usePartners(user)
  // "Ride one more" and "Review one more" for today.
  const [extra, addExtra] = useDayCount(EXTRA_KEY, user.id, today)
  const [redoExtra, addRedoExtra] = useDayCount(REDO_EXTRA_KEY, user.id, today)

  useEffect(() => {
    const onHash = () => {
      const next = readHash()
      setTab((prev) => {
        if (next === 'editorial' && prev !== 'editorial') setEdFrom(prev)
        return next
      })
      setEdKey(readEditorialKey())
      // An editorial link inside the station sheet closes the sheet.
      if (next === 'editorial') {
        setStation(null)
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), toast.undo ? 7000 : 5000)
    return () => clearTimeout(t)
  }, [toast])

  const go = (id) => {
    // Tapping Map while on the map goes back to all lines.
    if (id === 'map' && tab === 'map') setMapLine(null)
    window.location.hash = id
    setTab(id)
    window.scrollTo(0, 0)
  }

  const setRide = useCallback((r) => {
    writeJSON(RIDE_KEY, r)
    setRideState(r)
  }, [])

  // Runs an action and turns a failure into a toast instead of a crash.
  const run = useCallback(async (fn) => {
    try {
      await fn()
      return true
    } catch (e) {
      setToast({ kind: 'error', text: e.message || 'Something went wrong.' })
      return false
    }
  }, [])

  // A short message after an action. With `undo`, the toast has an Undo button.
  const say = useCallback((text, undo) => setToast({ kind: 'info', text, undo }), [])

  const undoToast = async () => {
    const undo = toast?.undo
    setToast(null)
    if (undo && (await run(undo))) setToast({ kind: 'info', text: 'Undone.' })
  }

  const endRide = useCallback(() => {
    setRide(null)
    window.scrollTo(0, 0)
  }, [setRide])

  const closeStation = useCallback(() => setStation(null), [])

  const board = (item, kind) => {
    setStation(null)
    setRide({ uid: user.id, key: item.key, kind, startedAt: Date.now() })
    go('today')
  }

  let body
  if (state.loading) body = <Skeleton />
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
    body = <Ride ride={ride} state={state} actions={actions} run={run} say={say} onUpdate={setRide} onExit={endRide} />
  else if (tab === 'today')
    body = (
      <Today
        state={state}
        actions={actions}
        run={run}
        say={say}
        onBoard={board}
        today={today}
        extra={extra}
        onMore={addExtra}
        redoExtra={redoExtra}
        onMoreReview={addRedoExtra}
        partners={partners}
      />
    )
  else if (tab === 'map')
    body = (
      <MapView
        state={state}
        today={today}
        line={mapLine}
        onLine={setMapLine}
        search={mapSearch}
        onSearch={setMapSearch}
        onStation={setStation}
      />
    )
  else if (tab === 'editorial')
    body = <Editorial itemKey={edKey} onBack={() => go(edFrom && edFrom !== 'editorial' ? edFrom : 'today')} />
  else if (tab === 'stats') body = <Stats user={user} state={state} partners={partners} today={today} onStation={setStation} />
  else if (tab === 'notes')
    body = <Notes user={user} state={state} actions={actions} run={run} say={say} partners={partners} onStation={setStation} />
  else if (tab === 'kit') body = <Kit />
  else body = <Settings user={user} state={state} actions={actions} run={run} say={say} partners={partners} onPartners={reloadPartners} />

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

      <main className={tab === 'stats' || (tab === 'today' && !ride) ? 'content content-wide' : 'content'}>
        <div className="view" key={ride && tab === 'today' ? 'ride' : tab}>
          {body}
        </div>
      </main>

      {station && (
        <StationSheet
          item={station}
          state={state}
          actions={actions}
          run={run}
          say={say}
          ride={ride}
          onBoard={board}
          onClose={closeStation}
        />
      )}

      {toast && (
        <div className={`toast toast-${toast.kind}`} role={toast.kind === 'error' ? 'alert' : 'status'}>
          <span>{toast.text}</span>
          {toast.undo && (
            <button className="toast-undo" onClick={undoToast}>
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Grey blocks in the shape of the board while data loads.
function Skeleton() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="Loading your line">
      <i className="sk sk-title" />
      <i className="sk sk-line" />
      <i className="sk sk-block" />
      <i className="sk sk-block sk-tall" />
    </div>
  )
}
