import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './supabase'
import { DEFAULT_SKIPPED, SHEET } from './sheet'
import { addDays, dayString, weekStart } from './dates'
import { afterNewSolve, afterReview } from './schedule'

const PROGRESS_COLS = 'item_key,status,stage,next_review,done_at,updated_at'
export const ATTEMPT_COLS = 'id,user_id,item_key,kind,result,minutes,pattern,key_idea,mistake,complexity,approach,created_at'
const SETTINGS_COLS = 'weekly_budget,finish_by,display_name,timezone,email_morning,email_evening,email_weekly'
const INVITE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function fail(error, what) {
  if (error) throw new Error(`${what}: ${error.message}`)
}

// Loads and changes one user's Terminus data. Every write goes to Supabase first;
// local state changes only after the write succeeds.
export function useTerminus(user) {
  const [state, setState] = useState({ loading: true, error: null, budget: 4, settings: {}, progress: new Map(), attempts: [] })
  // Counts local writes. A load that started before a write would bring back
  // old rows, so its result is dropped.
  const writes = useRef(0)

  const load = useCallback(async () => {
    const seq = writes.current
    try {
      const uid = user.id
      let { data: settings, error } = await supabase.from('settings').select(SETTINGS_COLS).eq('user_id', uid).maybeSingle()
      fail(error, 'Could not read settings')
      if (!settings) {
        // First visit: create settings and pre-skip lessons for other languages.
        const ins = await supabase.from('settings').insert({ user_id: uid }).select(SETTINGS_COLS).single()
        fail(ins.error, 'Could not create settings')
        settings = ins.data
        const keys = SHEET.items.filter((it) => DEFAULT_SKIPPED.includes(it.slug)).map((it) => it.key)
        const rows = keys.map((item_key) => ({ user_id: uid, item_key, status: 'skipped' }))
        const up = await supabase.from('progress').upsert(rows, { onConflict: 'user_id,item_key', ignoreDuplicates: true })
        fail(up.error, 'Could not set up your sheet')
      }
      // Keep the name your partner sees and the time zone for emails current.
      const name = (user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '').slice(0, 80)
      let tz = 'Asia/Kolkata'
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz
      } catch {
        /* keep the default */
      }
      if (settings.display_name !== name || settings.timezone !== tz) {
        const upd = await supabase.from('settings').update({ display_name: name, timezone: tz }).eq('user_id', uid)
        if (!upd.error) settings = { ...settings, display_name: name, timezone: tz }
      }
      // About half a year: enough for the Stats activity grid (20 weeks).
      const since = addDays(weekStart(dayString()), -182)
      const [prog, att] = await Promise.all([
        supabase.from('progress').select(PROGRESS_COLS).eq('user_id', uid).limit(2000),
        supabase.from('attempts').select(ATTEMPT_COLS).eq('user_id', uid).gte('created_at', new Date(since).toISOString()).order('created_at').limit(5000),
      ])
      fail(prog.error, 'Could not read progress')
      fail(att.error, 'Could not read attempts')
      if (seq !== writes.current) return
      setState({
        loading: false,
        error: null,
        budget: settings.weekly_budget,
        settings,
        progress: new Map(prog.data.map((r) => [r.item_key, r])),
        attempts: att.data,
      })
    } catch (e) {
      // A failed background refresh keeps the data already on screen.
      setState((s) => (s.loading || s.error ? { ...s, loading: false, error: e.message } : s))
    }
  }, [user])

  useEffect(() => {
    load()
    // Phone and laptop share one account: refresh when the app comes back
    // into view, so changes made on the other device show up.
    const onShow = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onShow)
    return () => document.removeEventListener('visibilitychange', onShow)
  }, [load])

  const putProgress = useCallback(
    async (item_key, fields) => {
      writes.current++
      const row = { user_id: user.id, item_key, ...fields, updated_at: new Date().toISOString() }
      const { data, error } = await supabase.from('progress').upsert(row, { onConflict: 'user_id,item_key' }).select(PROGRESS_COLS).single()
      fail(error, 'Could not save')
      writes.current++
      setState((s) => {
        const progress = new Map(s.progress)
        progress.set(item_key, data)
        return { ...s, progress }
      })
    },
    [user.id],
  )

  const addAttempt = useCallback(
    async (fields) => {
      writes.current++
      const { data, error } = await supabase.from('attempts').insert({ user_id: user.id, ...fields }).select(ATTEMPT_COLS).single()
      fail(error, 'Could not save your note')
      writes.current++
      setState((s) => ({ ...s, attempts: [...s.attempts, data] }))
    },
    [user.id],
  )

  const actions = useMemo(
    () => ({
      reload: load,

      async setBudget(n) {
        const weekly_budget = Math.max(1, Math.min(50, n))
        writes.current++
        const { error } = await supabase.from('settings').update({ weekly_budget }).eq('user_id', user.id)
        fail(error, 'Could not save the budget')
        writes.current++
        setState((s) => ({ ...s, budget: weekly_budget, settings: { ...s.settings, weekly_budget } }))
      },

      // Any other setting: goal date, email choices.
      async setSettings(patch) {
        writes.current++
        const { error } = await supabase.from('settings').update(patch).eq('user_id', user.id)
        fail(error, 'Could not save the setting')
        writes.current++
        setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
      },

      async mark(item, status) {
        await putProgress(item.key, { status, stage: 0, next_review: null, done_at: null })
      },

      // Puts an item back on the line as not done (undo "I know this" or skip).
      async clear(item) {
        writes.current++
        const { error } = await supabase.from('progress').delete().eq('user_id', user.id).eq('item_key', item.key)
        fail(error, 'Could not undo')
        writes.current++
        setState((s) => {
          const progress = new Map(s.progress)
          progress.delete(item.key)
          return { ...s, progress }
        })
      },

      // Puts back a progress row as it was before (for Undo). No row = not done.
      async restore(item, row) {
        if (!row) return this.clear(item)
        const { status, stage, next_review, done_at } = row
        await putProgress(item.key, { status, stage, next_review, done_at })
      },

      async finishNew(item, note) {
        const today = dayString()
        await addAttempt({ item_key: item.key, kind: 'new', ...note })
        await putProgress(item.key, { ...afterNewSolve(item, today), done_at: new Date().toISOString() })
      },

      async finishReview(item, row, note) {
        const today = dayString()
        await addAttempt({ item_key: item.key, kind: 'review', ...note })
        await putProgress(item.key, { ...afterReview(row, note.result, today), done_at: row.done_at })
      },

      // All sessions of one station, newest first. Pass a partner's id to read theirs.
      async history(item, uid = user.id) {
        const { data, error } = await supabase
          .from('attempts')
          .select(ATTEMPT_COLS)
          .eq('user_id', uid)
          .eq('item_key', item.key)
          .order('created_at', { ascending: false })
          .limit(50)
        fail(error, 'Could not read history')
        return data
      },

      // Every session that has a note, newest first, for the Notes tab.
      async notes(uid = user.id) {
        const { data, error } = await supabase
          .from('attempts')
          .select(ATTEMPT_COLS)
          .eq('user_id', uid)
          .or('pattern.not.is.null,key_idea.not.is.null,mistake.not.is.null,complexity.not.is.null,approach.not.is.null')
          .order('created_at', { ascending: false })
          .limit(3000)
        fail(error, 'Could not read your notes')
        return data
      },

      // Edits the text of one saved note. Only your own.
      async updateNote(id, fields) {
        const clean = {
          pattern: fields.pattern?.trim().slice(0, 200) || null,
          key_idea: fields.key_idea?.trim().slice(0, 2000) || null,
          mistake: fields.mistake?.trim().slice(0, 2000) || null,
          complexity: fields.complexity?.trim().slice(0, 200) || null,
          approach: fields.approach?.trim().slice(0, 8000) || null,
        }
        writes.current++
        const { data, error } = await supabase.from('attempts').update(clean).eq('id', id).eq('user_id', user.id).select(ATTEMPT_COLS).single()
        fail(error, 'Could not save the note')
        writes.current++
        setState((s) => ({ ...s, attempts: s.attempts.map((a) => (a.id === id ? data : a)) }))
        return data
      },

      // ---------- Partner ----------

      async createInvite() {
        // Old codes of mine go; one live code at a time.
        await supabase.from('invites').delete().eq('owner', user.id)
        const bytes = crypto.getRandomValues(new Uint8Array(6))
        const code = [...bytes].map((b) => INVITE_LETTERS[b % INVITE_LETTERS.length]).join('')
        const { error } = await supabase.from('invites').insert({ code, owner: user.id })
        fail(error, 'Could not make a code')
        return code
      },

      async acceptInvite(code) {
        const { error } = await supabase.rpc('accept_invite', { p_code: code })
        if (error) throw new Error(error.message)
      },

      async removePartner(id) {
        const { error } = await supabase.rpc('remove_partner', { p_partner: id })
        fail(error, 'Could not remove the link')
      },
    }),
    [load, putProgress, addAttempt, user.id],
  )

  return [state, actions]
}
