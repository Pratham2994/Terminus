import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Search, X } from 'lucide-react'
import { ITEM_BY_KEY } from '../lib/sheet'
import { LineBadge } from './bits'
import { NoteView, RESULT_TEXT, splitComplexity } from './noteBits'

function norm(text) {
  return (text || '').toLowerCase()
}

function shortDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

// Every station you wrote a note for, with search, filters and editing.
export default function Notes({ user, state, actions, run, say, partners, onStation }) {
  const [who, setWho] = useState(user.id)
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [pattern, setPattern] = useState(null)
  const [sort, setSort] = useState('recent')
  const mine = who === user.id
  const owner = mine ? null : partners.find((p) => p.id === who)

  // Reload when you switch person, and when your own sessions change.
  const myVersion = mine ? state.attempts.length : 0
  useEffect(() => {
    let live = true
    setError(null)
    actions
      .notes(who)
      .then((data) => live && setRows(data))
      .catch((e) => live && setError(e.message))
    return () => {
      live = false
    }
  }, [who, actions, myVersion])

  // One card per station: its newest note, plus the older ones.
  const stations = useMemo(() => {
    if (!rows) return []
    const by = new Map()
    for (const a of rows) {
      const item = ITEM_BY_KEY.get(a.item_key)
      if (!item) continue
      if (!by.has(a.item_key)) by.set(a.item_key, { item, notes: [] })
      by.get(a.item_key).notes.push(a)
    }
    return [...by.values()].map((s) => ({ ...s, latest: s.notes[0] }))
  }, [rows])

  const patterns = useMemo(() => {
    const count = new Map()
    for (const s of stations) {
      const p = s.latest.pattern?.trim()
      if (p) count.set(p, (count.get(p) || 0) + 1)
    }
    return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
  }, [stations])

  const shown = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    let list = stations.filter((s) => {
      if (pattern && s.latest.pattern?.trim() !== pattern) return false
      if (!words.length) return true
      const text = norm(
        [s.item.label, s.item.section, s.item.line.name, ...s.notes.flatMap((n) => [n.pattern, n.key_idea, n.approach, n.mistake, n.complexity])].join(' '),
      )
      return words.every((w) => text.includes(w))
    })
    if (sort === 'sheet') list = [...list].sort((a, b) => a.item.order - b.item.order)
    return list
  }, [stations, q, pattern, sort])

  const onEdited = (updated) => {
    setRows((r) => r.map((a) => (a.id === updated.id ? updated : a)))
    say('Note saved.')
  }

  return (
    <section className="notes" aria-labelledby="notes-title">
      <header className="page-head">
        <h1 id="notes-title">Notes</h1>
        <p>{mine ? 'Everything you wrote, one card per station. Edit any note.' : `${owner?.name}’s notes. Read only.`}</p>
      </header>

      {partners.length > 0 && <WhoSwitch user={user} partners={partners} who={who} onWho={setWho} />}

      <div className="finder">
        <div className="search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setQ('')}
            placeholder="Search notes, ideas, code"
            aria-label="Search notes"
            autoComplete="off"
            spellCheck="false"
          />
          {q && (
            <button className="search-clear" aria-label="Clear search" onClick={() => setQ('')}>
              <X size={16} />
            </button>
          )}
        </div>
        {patterns.length > 0 && (
          <div className="chips" role="group" aria-label="Filter by pattern">
            <button className="chip-f" aria-pressed={pattern === null} onClick={() => setPattern(null)}>
              All patterns
            </button>
            {patterns.map(([p, n]) => (
              <button key={p} className="chip-f" aria-pressed={pattern === p} onClick={() => setPattern(pattern === p ? null : p)}>
                {p}
                <span className="mono">{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <div className="notice">
          <p>{error}</p>
        </div>
      ) : rows === null ? (
        <div className="skeleton" aria-busy="true">
          <i className="sk sk-block sk-tall" />
          <i className="sk sk-block sk-tall" />
        </div>
      ) : stations.length === 0 ? (
        <p className="board-empty">
          {mine
            ? 'No notes yet. After you solve a problem, the note you save shows up here.'
            : `${owner?.name} has no notes yet.`}
        </p>
      ) : (
        <>
          <div className="notes-bar">
            <span className="results-count">
              {shown.length} of {stations.length} {stations.length === 1 ? 'station' : 'stations'}
            </span>
            <label className="sort">
              <span className="sr-only">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recent">Newest first</option>
                <option value="sheet">Sheet order</option>
              </select>
            </label>
          </div>
          {shown.length === 0 ? (
            <p className="board-empty">No notes match.</p>
          ) : (
            <ol className="note-cards">
              {shown.map((s) => (
                <NoteCard
                  key={s.item.key}
                  station={s}
                  editable={mine}
                  actions={actions}
                  run={run}
                  onEdited={onEdited}
                  onStation={mine ? onStation : null}
                />
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  )
}

export function WhoSwitch({ user, partners, who, onWho }) {
  return (
    <div className="who" role="group" aria-label="Whose data">
      <button aria-pressed={who === user.id} onClick={() => onWho(user.id)}>
        You
      </button>
      {partners.map((p) => (
        <button key={p.id} aria-pressed={who === p.id} onClick={() => onWho(p.id)}>
          {p.name.split(' ')[0]}
        </button>
      ))}
    </div>
  )
}

function NoteCard({ station, editable, actions, run, onEdited, onStation }) {
  const { item, notes, latest } = station
  const [editing, setEditing] = useState(false)
  const [open, setOpen] = useState(false)
  const older = notes.slice(1)

  return (
    <li className="note-card" style={{ '--c': item.line.color }}>
      <header className="nc-head">
        <LineBadge line={item.line} />
        <div className="nc-title">
          {onStation ? (
            <button className="nc-name" onClick={() => onStation(item)}>
              {item.label}
            </button>
          ) : (
            <span className="nc-name">{item.label}</span>
          )}
          <span className="nc-sub">
            {item.line.name} • {item.section}
          </span>
        </div>
        {editable && !editing && (
          <button className="icon-btn" aria-label={`Edit the note for ${item.label}`} title="Edit" onClick={() => setEditing(true)}>
            <Pencil size={17} />
          </button>
        )}
      </header>

      {editing ? (
        <NoteEditor
          note={latest}
          actions={actions}
          run={run}
          onCancel={() => setEditing(false)}
          onSaved={(n) => {
            setEditing(false)
            onEdited(n)
          }}
        />
      ) : (
        <NoteView note={latest} />
      )}

      <footer className="nc-foot">
        <span>
          <span className={`h-result r-${latest.result}`}>{RESULT_TEXT[latest.result]}</span> • {shortDate(latest.created_at)}
        </span>
        {older.length > 0 && (
          <button className="nc-more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? 'Hide' : `${older.length} older ${older.length === 1 ? 'note' : 'notes'}`}
            {open ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
          </button>
        )}
      </footer>

      {open && (
        <ol className="nc-older">
          {older.map((n) => (
            <li key={n.id}>
              <p className="nc-when">
                <span className={`h-result r-${n.result}`}>{RESULT_TEXT[n.result]}</span> • {shortDate(n.created_at)}
              </p>
              <NoteView note={n} />
            </li>
          ))}
        </ol>
      )}
    </li>
  )
}

function NoteEditor({ note, actions, run, onCancel, onSaved }) {
  const c = splitComplexity(note.complexity)
  const [f, setF] = useState({
    pattern: note.pattern || '',
    key_idea: note.key_idea || '',
    approach: note.approach || '',
    mistake: note.mistake || '',
    time: c.time,
    space: c.space,
  })
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    let saved = null
    const complexity = [f.time.trim() && `T ${f.time.trim()}`, f.space.trim() && `S ${f.space.trim()}`].filter(Boolean).join(' • ')
    const ok = await run(async () => {
      saved = await actions.updateNote(note.id, { ...f, complexity })
    })
    setBusy(false)
    if (ok && saved) onSaved(saved)
  }

  return (
    <form className="note note-edit" onSubmit={save}>
      <label className="field">
        <span>Pattern</span>
        <input value={f.pattern} onChange={set('pattern')} maxLength={200} />
      </label>
      <label className="field">
        <span>Key idea</span>
        <textarea value={f.key_idea} onChange={set('key_idea')} rows={3} maxLength={2000} />
      </label>
      <label className="field">
        <span>Approach or code</span>
        <textarea className="mono-input" value={f.approach} onChange={set('approach')} rows={7} maxLength={8000} spellCheck="false" />
      </label>
      <label className="field">
        <span>Mistake</span>
        <textarea value={f.mistake} onChange={set('mistake')} rows={2} maxLength={2000} />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Time complexity</span>
          <input value={f.time} onChange={set('time')} maxLength={60} />
        </label>
        <label className="field">
          <span>Space complexity</span>
          <input value={f.space} onChange={set('space')} maxLength={60} />
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-quiet" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-go" disabled={busy}>
          {busy ? 'Saving…' : 'Save note'}
        </button>
      </div>
    </form>
  )
}
