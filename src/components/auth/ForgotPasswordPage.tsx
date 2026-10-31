import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
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
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setBusy(false)
    // Supabase doesn't reveal whether the email exists, so any non-rate-limit
    // error here is something like a malformed request, not an unknown email.
    if (err) {
      setError(err.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <div className="auth-card-head">
          <h2>Reset your password</h2>
          <p className="section-subtitle">We'll email you a link to set a new password.</p>
        </div>

        {sent ? (
          <p className="admin-saved">
            If that email has an account, a reset link is on its way. Check your inbox.
          </p>
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
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="form-submit auth-submit" disabled={busy}>
              {busy ? 'Please wait…' : 'Send reset link'}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>Remembered it?</span>
        </div>
        <Link to="/login" className="auth-switch">
          Back to sign in
        </Link>
      </section>
    </div>
  )
}
