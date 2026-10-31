import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [validLink, setValidLink] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseConfigured) {
      setReady(true)
      return
    }
    // Supabase's client exchanges the recovery token in the URL for a session
    // automatically; by the time this fires, a session means the link was valid.
    supabase.auth.getSession().then(({ data }) => {
      setValidLink(!!data.session)
      setReady(true)
    })
  }, [])

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
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setBusy(true)
    setError(null)
    const { error: err } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div className="auth-page">
      <section className="card auth-card">
        <div className="auth-card-head">
          <h2>Set a new password</h2>
        </div>

        {!ready ? (
          <p className="section-subtitle">Checking your link…</p>
        ) : done ? (
          <p className="admin-saved">Password updated. Taking you to sign in…</p>
        ) : !validLink ? (
          <>
            <p className="auth-error">
              This reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="auth-switch">
              Request a new link
            </Link>
          </>
        ) : (
          <form onSubmit={submit} className="auth-form">
            <label className="form-field">
              <span>New password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoFocus
              />
            </label>
            <label className="form-field">
              <span>Confirm password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="form-submit auth-submit" disabled={busy}>
              {busy ? 'Please wait…' : 'Update password'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
