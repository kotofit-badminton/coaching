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
      <div className="auth-page">
        <section className="card auth-card">
          <h2>Sign-in unavailable</h2>
          <p className="section-subtitle">This copy of the app has no sign-in service configured.</p>
        </section>
      </div>
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
    <div className="auth-page">
      <section className="card auth-card">
        <div className="auth-card-head">
          <h2>Welcome back</h2>
          <p className="section-subtitle">Sign in with the email and password you signed up with.</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="form-submit auth-submit" disabled={busy}>
            {busy ? 'Please wait…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider">
          <span>New here?</span>
        </div>

        <Link to="/signup" className="auth-switch">
          Create a family account
        </Link>
        <p className="auth-hint">
          You'll answer a few quick questions about the player first, then set up the account
          at the end. Coaches and admins are set up by the club.
        </p>
      </section>
    </div>
  )
}
