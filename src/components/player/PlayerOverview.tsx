import type { Band, Journey, OnboardingEvaluation, Player } from '../../types'
import { formatDate } from '../../utils/format'
import { ageGroupLabel, levelWord } from '../../data/definitions'
import { objectiveLabels } from '../../data/journeyTemplates'
import {
  currentJourneyRating,
  lastBlockDelta,
  targetJourneyRating,
} from '../../data/journeyDerive'
import RatingStat from '../journey/RatingStat'
import heroImg from '../../assets/hero-player.jpg'

interface Props {
  player: Player
  journey: Journey
  onboarding?: OnboardingEvaluation
  band: Band
  onNavigate?: (id: string) => void
}

export default function PlayerOverview({ player, journey, onboarding, onNavigate }: Props) {
  const rating = currentJourneyRating(journey)
  const target = targetJourneyRating(journey)
  const delta = lastBlockDelta(journey)
  const { totalClasses } = journey.projection
  const done = journey.classesCompleted
  const pct = Math.min(100, Math.round((done / totalClasses) * 100))

  return (
    <section className="card player-overview">
      <div className="player-hero">
        <img className="player-hero-img" src={heroImg} alt="" aria-hidden="true" />
        <div className="player-hero-body">
          <div className="player-overview-tags">
            <span className={`jrny-objective-pill obj-${player.objective}`}>
              {objectiveLabels[player.objective]}
            </span>
            <span className="jrny-tag">{ageGroupLabel(player.band)}</span>
            <span className="jrny-tag muted">Started {formatDate(player.joinDate)}</span>
          </div>
          <h1 className="player-overview-name">{player.name}</h1>
          <p className="player-overview-summary">
            {player.name} is <strong>{pct}%</strong> of the way through the plan
            {delta != null && delta > 0 ? ' and playing well for their age' : ''}.
          </p>
          <div className="player-hero-actions">
            <button type="button" className="player-hero-btn primary" onClick={() => onNavigate?.('plan')}>
              See the plan
            </button>
            <button type="button" className="player-hero-btn" onClick={() => onNavigate?.('progress')}>
              See progress
            </button>
          </div>
        </div>
      </div>

      <div className="review-stats player-overview-stats">
        <RatingStat
          label="Level now"
          value={rating}
          objective={player.objective}
          band={player.band}
          skillCount={journey.skillTargets.length}
        />
        <div className="review-stat">
          <span className="review-stat-value review-stat-text">{levelWord(rating)}</span>
          <span className="review-stat-label">In words</span>
        </div>
        <div className="review-stat">
          <span className="review-stat-value">
            {done}
            <span className="review-stat-sub">/{totalClasses}</span>
          </span>
          <span className="review-stat-label">Classes done</span>
        </div>
        <div className="review-stat">
          <span className="review-stat-value">
            {target.toFixed(1)}
            <span className="review-stat-sub">/5</span>
          </span>
          <span className="review-stat-label">Aiming for</span>
        </div>
      </div>

      <div className="jrny-projection-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-label">
          {done} of {totalClasses} classes · {pct}% there
        </div>
      </div>

      {onboarding && (
        <p className="player-overview-note">
          <strong>From registration.</strong> {onboarding.notes}
        </p>
      )}
    </section>
  )
}
