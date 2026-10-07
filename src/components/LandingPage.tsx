import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'

export default function LandingPage() {
  const { activeProfile, getPlayer, players } = useStore()
  const navigate = useNavigate()

  const resume =
    activeProfile?.kind === 'player'
      ? getPlayer(activeProfile.playerId)
      : null

  return (
    <div className="landing">
      <section className="landing-hero">
        <span className="landing-eyebrow">KotoFit · Jersey City</span>
        <h1 className="landing-title">One clear plan for every player.</h1>
        <p className="landing-lede">
          A coach checks where a player is now, the player picks what they want out of the
          sport, and KotoFit lays out the plan to get there — the skills to grow, the drills
          to do, and roughly how many classes it takes.
        </p>
        {resume && (
          <button
            type="button"
            className="landing-resume"
            onClick={() => navigate(`/player/${resume.id}`)}
          >
            Continue as {resume.name} →
          </button>
        )}
      </section>

      <section className="landing-cards">
        <Link to="/register" className="landing-card">
          <span className="landing-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="landing-card-title">New player</span>
          <span className="landing-card-desc">
            Answer a few quick questions, get a suggested plan, and start straight away.
          </span>
          <span className="landing-card-cta">Get started →</span>
        </Link>

        <Link to="/players" className="landing-card">
          <span className="landing-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
              <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 6.5a3 3 0 0 1 0 6M18 19c0-2.4-1.2-4.2-3-4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="landing-card-title">Player plans</span>
          <span className="landing-card-desc">
            Open any player to see their plan, week by week, and how it's going.
          </span>
          <span className="landing-card-cta">{players.length} players →</span>
        </Link>

        <Link to="/coach" className="landing-card">
          <span className="landing-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path d="M4 20v-1a5 5 0 0 1 5-5h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
              <path d="m15 15 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="landing-card-title">Coach portal</span>
          <span className="landing-card-desc">
            Add an update on a player — classes done and where each skill is now — or redo
            their assessment.
          </span>
          <span className="landing-card-cta">Open portal →</span>
        </Link>

        <Link to="/admin" className="landing-card">
          <span className="landing-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3.5 9.5h17M8 4.5v15" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <span className="landing-card-title">Admin portal</span>
          <span className="landing-card-desc">
            Roster grouped by objective, run registrations, and build classes.
          </span>
          <span className="landing-card-cta">Open portal →</span>
        </Link>
      </section>
    </div>
  )
}
