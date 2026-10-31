import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'

/** Plain email/password sign-up for coach and admin — no questionnaire. */
export default function StaffSignup() {
  const [params] = useSearchParams()
  const next = params.get('next') || '/coach'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

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
    setNotice(null)
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}` },
    })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setNotice('Account created. Check your email to confirm it, then ask a club owner to grant coach or admin access before signing in here.')
  }

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <div className="auth-card-head">
          <h2>Create a staff account</h2>
          <p className="section-subtitle">
            For coaches and admins. No questionnaire, just an email and password — access is
            granted separately by a club owner.
          </p>
        </div>

        {notice ? (
          <p className="admin-saved">{notice}</p>
        ) : (
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="form-submit auth-submit" disabled={busy}>
              {busy ? 'Please wait…' : 'Create account'}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>
        <Link to={`/login?next=${encodeURIComponent(next)}`} className="auth-switch">
          Sign in instead
        </Link>
      </section>
    </div>
  )
}
