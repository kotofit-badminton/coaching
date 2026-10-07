import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'

export default function LoginPage() {
  const [params] = useSearchParams()
  const next = params.get('next') || '/'
  const navigate = useNavigate()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

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
    setNotice(null)
    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      setBusy(false)
      if (err) setError('That email or password does not match.')
      else navigate(next)
    } else {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
        },
      })
      setBusy(false)
      if (err) setError(err.message)
      else setNotice('Check your email to confirm your account, then sign in.')
    }
  }

  return (
    <section className="card auth-card">
      <h2>{mode === 'signin' ? 'Sign in' : 'Create an account'}</h2>
      <p className="section-subtitle">
        {mode === 'signin'
          ? 'Use the email and password you signed up with.'
          : 'New accounts are for families. Coaches and admins are set up by the club.'}
      </p>
      <form onSubmit={submit} className="admin-form">
        <label className="form-field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {error && <p className="coach-reeval-warn">{error}</p>}
        {notice && <p className="admin-saved">{notice}</p>}
        <button type="submit" className="form-submit" disabled={busy}>
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <button
        type="button"
        className="reset-btn"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError(null)
          setNotice(null)
        }}
      >
        {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
      </button>
    </section>
  )
}
