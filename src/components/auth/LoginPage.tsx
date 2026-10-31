import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'

export default function LoginPage() {
  const [params] = useSearchParams()
  const next = params.get('next') || '/'
  const isStaffNext = next.startsWith('/coach') || next.startsWith('/admin')
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
    if (err) {
      if (/confirm/i.test(err.message)) {
        setError('Check your email and confirm your account before signing in.')
      } else if (/invalid login credentials/i.test(err.message)) {
        setError('That email or password does not match.')
      } else {
        setError(err.message)
      }
    } else {
      navigate(next)
    }
  }

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <span className="auth-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3c2.2 2.4 3.4 5.6 3.4 9s-1.2 6.6-3.4 9M12 3c-2.2 2.4-3.4 5.6-3.4 9s1.2 6.6 3.4 9M3.5 9h17M3.5 15h17" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
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
          <Link to="/forgot-password" className="auth-forgot">
            Forgot password?
          </Link>
        </form>

        <div className="auth-divider">
          <span>New here?</span>
        </div>

        {isStaffNext ? (
          <>
            <Link to={`/signup/staff?next=${encodeURIComponent(next)}`} className="auth-switch">
              Create a coach or admin account
            </Link>
            <p className="auth-hint">
              Just an email and password, no questionnaire. A club owner still needs to grant
              coach or admin access before you can sign in to those areas.
            </p>
          </>
        ) : (
          <>
            <Link to="/signup" className="auth-switch">
              Create an account
            </Link>
            <p className="auth-hint">
              You'll answer a few quick questions about the player first, then set up your
              account at the end. Coaches and admins are set up by the club.
            </p>
          </>
        )}
      </section>
    </div>
  )
}
