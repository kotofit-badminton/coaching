import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../data/store'
import { objectiveLabels } from '../../data/journeyTemplates'
import { ageGroupLabel } from '../../data/definitions'
import {
  currentJourneyRating,
  currentPhase,
  nextCheckpoint,
  targetJourneyRating,
} from '../../data/journeyDerive'
import CoachLog from './CoachLog'
import CoachReeval from './CoachReeval'
import PlayerDiary from '../player/PlayerDiary'

type Tab = 'log' | 'reeval' | 'diary'

export default function CoachPortal() {
  const { players, getPlayer, getJourney, signInAsCoach } = useStore()
  const [playerId, setPlayerId] = useState(players[0]?.id ?? '')
  const [tab, setTab] = useState<Tab>('log')

  useEffect(() => {
    signInAsCoach()
  }, [])

  const journey = getJourney(playerId)
  const phase = journey ? currentPhase(journey) : undefined
  const next = journey ? nextCheckpoint(journey) : undefined

  return (
    <div className="coach-portal">
      <h1 className="admin-page-title">Coach portal</h1>
      <p className="section-subtitle">
        Add an update on a player, or re-do their assessment.
      </p>

      <div className="card coach-picker">
        <label className="form-field">
          <span>Player</span>
          <select value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {ageGroupLabel(p.band)} · {objectiveLabels[p.objective]}
              </option>
            ))}
          </select>
        </label>

        {journey && (
          <div className="coach-snapshot">
            <span className={`jrny-objective-pill obj-${journey.objective}`}>
              {objectiveLabels[journey.objective]}
            </span>
            <span className="coach-snapshot-item">
              Level <strong>{currentJourneyRating(journey).toFixed(1)}</strong> /{' '}
              {targetJourneyRating(journey).toFixed(1)}
            </span>
            <span className="coach-snapshot-item">
              <strong>{journey.classesCompleted}</strong>/{journey.projection.totalClasses} classes
            </span>
            {phase && (
              <span className="coach-snapshot-item">
                Step: <strong>{phase.name}</strong>
              </span>
            )}
            {next && (
              <span className="coach-snapshot-item">
                Next: <strong>{next.label}</strong>
              </span>
            )}
            <Link className="coach-snapshot-link" to={`/player/${playerId}`}>
              Open plan →
            </Link>
          </div>
        )}
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Coach actions">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'log'}
          className={`admin-tab${tab === 'log' ? ' active' : ''}`}
          onClick={() => setTab('log')}
        >
          Add an update
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'diary'}
          className={`admin-tab${tab === 'diary' ? ' active' : ''}`}
          onClick={() => setTab('diary')}
        >
          Diary note
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'reeval'}
          className={`admin-tab${tab === 'reeval' ? ' active' : ''}`}
          onClick={() => setTab('reeval')}
        >
          Redo assessment
        </button>
      </div>

      {tab === 'log' && <CoachLog key={`log-${playerId}`} playerId={playerId} />}
      {tab === 'reeval' && <CoachReeval key={`reeval-${playerId}`} playerId={playerId} />}
      {tab === 'diary' && (
        <PlayerDiary
          key={`diary-${playerId}`}
          as="coach"
          playerId={playerId}
          playerName={getPlayer(playerId)?.name ?? 'Player'}
        />
      )}
    </div>
  )
}
