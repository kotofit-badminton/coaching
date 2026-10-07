import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'

export default function LoginPage() {
  const [params] = useSearchParams()
  const next = params.get('next') || '/'
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!supabaseConfigured) {
    return (
      <section className="card">
        <h2>Sign-in unavailable</h2>
        <p className="section-subtitle">This copy of the app has no sign-in service configured.</p>
      </section>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) setError('That email or password does not match.')
    else navigate(next)
  }

  return (
    <section className="card auth-card">
      <h2>Sign in</h2>
      <p className="section-subtitle">Use the email and password you signed up with.</p>
      <form onSubmit={submit} className="admin-form">
        <label className="form-field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {error && <p className="coach-reeval-warn">{error}</p>}
        <button type="submit" className="form-submit" disabled={busy}>
          {busy ? 'Please wait…' : 'Sign in'}
        </button>
      </form>
      <Link to="/signup" className="reset-btn">
        New here? Create an account
      </Link>
      <p className="section-subtitle">
        New families answer a few quick questions about the player first, then set up the
        account at the end. Coaches and admins are set up by the club.
      </p>
    </section>
  )
}
