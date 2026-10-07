import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'
import ThemeToggle from './ThemeToggle'
import ResetButton from './ResetButton'
import { supabase, supabaseConfigured } from '../lib/supabase'

export default function AppHeader() {
  const { activeProfile, getPlayer, signOut } = useStore()
  const navigate = useNavigate()

  let profileLabel: string | null = null
  let profileRole = ''
  if (activeProfile?.kind === 'admin') {
    profileLabel = 'Admin'
    profileRole = 'Admin portal'
  } else if (activeProfile?.kind === 'coach') {
    profileLabel = 'Coach'
    profileRole = 'Coach portal'
  } else if (activeProfile?.kind === 'player') {
    const p = getPlayer(activeProfile.playerId)
    profileLabel = p ? p.name : 'Player'
    profileRole = 'Player'
  }

  async function handleSignOut() {
    if (supabaseConfigured) await supabase.auth.signOut()
    signOut()
    navigate('/')
  }

  return (
    <header className="app-header">
      <Link to="/" className="app-header-brand">
        <span className="app-logo">KotoFit</span>
        <span className="app-header-sub">Your badminton plan</span>
      </Link>

      <div className="app-header-actions">
        {profileLabel && (
          <div className="profile-chip">
            <span className="profile-avatar" aria-hidden="true">
              {profileLabel.slice(0, 1).toUpperCase()}
            </span>
            <span className="profile-chip-text">
              <span className="profile-chip-name">{profileLabel}</span>
              <span className="profile-chip-role">{profileRole}</span>
            </span>
            <button type="button" className="profile-signout" onClick={handleSignOut}>
              Log out
            </button>
          </div>
        )}
        {!profileLabel && supabaseConfigured && (
          <Link to="/login" className="profile-signout">
            Sign in
          </Link>
        )}
        <ResetButton />
        <ThemeToggle />
      </div>
    </header>
  )
}
