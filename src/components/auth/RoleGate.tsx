import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import { rosterPlayers } from '../../data/roster'

export type Role = 'player' | 'coach' | 'admin'

type Need = { kind: 'staff'; allow: Role[] } | { kind: 'player'; playerId: string }

type State =
  | { status: 'loading' }
  | { status: 'anon' }
  | { status: 'ok'; role: Role; playerId: string | null }

// Mock players are seeded demo data and stay open, as agreed for the demo.
const MOCK_IDS = new Set(rosterPlayers.map((p) => p.id))

interface Props {
  need: Need
  children: ReactNode
}

export default function RoleGate({ need, children }: Props) {
  const location = useLocation()
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!supabaseConfigured) {
      setState({ status: 'anon' })
      return
    }
    let alive = true
    async function load(userId: string | undefined) {
      if (!userId) {
        if (alive) setState({ status: 'anon' })
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('role, player_id')
        .eq('id', userId)
        .maybeSingle()
      if (!alive) return
      setState({
        status: 'ok',
        role: (data?.role as Role) ?? 'player',
        playerId: data?.player_id ?? null,
      })
    }
    supabase.auth.getSession().then(({ data }) => load(data.session?.user.id))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      load(session?.user.id),
    )
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (need.kind === 'player' && MOCK_IDS.has(need.playerId)) return <>{children}</>

  if (state.status === 'loading') {
    return <p className="jrny-empty">Checking sign-in…</p>
  }
  if (state.status === 'anon') {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  if (need.kind === 'staff') {
    if (need.allow.includes(state.role)) return <>{children}</>
    return (
      <section className="card auth-card">
        <h2>Staff only</h2>
        <p className="section-subtitle">This area is for club staff. Sign in with a staff account to continue.</p>
      </section>
    )
  }

  const isStaff = state.role === 'coach' || state.role === 'admin'
  if (isStaff || state.playerId === need.playerId) return <>{children}</>
  return (
    <section className="card auth-card">
      <h2>This plan is private</h2>
      <p className="section-subtitle">You can only see the plan for the account you signed in with.</p>
    </section>
  )
}
