import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Role = 'player' | 'coach' | 'admin'

interface ProfileRow {
  id: string
  email: string | null
  role: Role
}

const ROLES: Role[] = ['player', 'coach', 'admin']

export default function StaffRoles() {
  const [profiles, setProfiles] = useState<ProfileRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  async function load() {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, email, role')
      .order('email')
    if (err) {
      setError(err.message)
      return
    }
    setProfiles((data ?? []) as ProfileRow[])
  }

  useEffect(() => {
    load()
  }, [])

  async function setRole(id: string, role: Role) {
    setSavingId(id)
    setError(null)
    const { error: err } = await supabase.from('profiles').update({ role }).eq('id', id)
    setSavingId(null)
    if (err) {
      setError(err.message)
      return
    }
    setProfiles((rows) => rows?.map((r) => (r.id === id ? { ...r, role } : r)) ?? rows)
  }

  return (
    <section className="card">
      <h2>Staff access</h2>
      <p className="section-subtitle">
        Everyone starts as a player when they sign up. Grant coach or admin access here.
      </p>

      {error && <p className="auth-error">{error}</p>}

      {!profiles ? (
        <p className="jrny-empty">Loading…</p>
      ) : profiles.length === 0 ? (
        <p className="jrny-empty">No accounts yet.</p>
      ) : (
        <div className="staff-roles-list">
          {profiles.map((p) => (
            <div className="staff-roles-row" key={p.id}>
              <span className="staff-roles-email">{p.email ?? p.id}</span>
              <select
                value={p.role}
                disabled={savingId === p.id}
                onChange={(e) => setRole(p.id, e.target.value as Role)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
