import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { addDays, dayString, weekStart } from './dates'
import { ATTEMPT_COLS } from './store'

// Loads the people you are linked with, and their progress (read only).
// Row-level security lets you read a partner's rows and nothing else.
export function usePartners(user) {
  const [state, setState] = useState({ loading: true, partners: [] })

  const load = useCallback(async () => {
    try {
      const links = await supabase.from('partners').select('partner_id').eq('user_id', user.id)
      if (links.error) throw links.error
      const ids = links.data.map((l) => l.partner_id)
      if (ids.length === 0) {
        setState({ loading: false, partners: [] })
        return
      }
      const since = new Date(addDays(weekStart(dayString()), -182)).toISOString()
      const [settings, progress, attempts] = await Promise.all([
        supabase.from('settings').select('user_id,display_name,weekly_budget,finish_by').in('user_id', ids),
        supabase.from('progress').select('user_id,item_key,status,stage,next_review,done_at,updated_at').in('user_id', ids).limit(5000),
        supabase.from('attempts').select(ATTEMPT_COLS).in('user_id', ids).gte('created_at', since).order('created_at').limit(10000),
      ])
      for (const r of [settings, progress, attempts]) if (r.error) throw r.error
      const partners = ids.map((id) => {
        const s = settings.data.find((x) => x.user_id === id) || {}
        return {
          id,
          name: s.display_name || 'Your partner',
          budget: s.weekly_budget || 4,
          finishBy: s.finish_by || null,
          progress: new Map(progress.data.filter((r) => r.user_id === id).map((r) => [r.item_key, r])),
          attempts: attempts.data.filter((a) => a.user_id === id),
        }
      })
      setState({ loading: false, partners })
    } catch {
      // The partner view is extra; on failure keep what is on screen.
      setState((s) => ({ ...s, loading: false }))
    }
  }, [user.id])

  useEffect(() => {
    load()
    const onShow = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onShow)
    return () => document.removeEventListener('visibilitychange', onShow)
  }, [load])

  return [state, load]
}
