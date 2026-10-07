import { useNavigate } from 'react-router-dom'
import type { Objective } from '../types'
import { useStore } from '../data/store'
import { objectiveLabels } from '../data/journeyTemplates'
import { ageGroupLabel } from '../data/definitions'
import { currentJourneyRating, targetJourneyRating } from '../data/journeyDerive'

const OBJECTIVES: Objective[] = ['fun', 'fitness', 'competitive']

export default function PlayerPicker() {
  const { players, getJourney, signInAsPlayer } = useStore()
  const navigate = useNavigate()

  function open(id: string) {
    signInAsPlayer(id)
    navigate(`/player/${id}`)
  }

  return (
    <div className="picker">
      <div className="picker-head">
        <h1>Choose a player</h1>
        <p className="section-subtitle">Open a player to see their plan and how it's going.</p>
      </div>

      {OBJECTIVES.map((objective) => {
        const group = players.filter((p) => p.objective === objective)
        if (group.length === 0) return null
        return (
          <div className="picker-group" key={objective}>
            <div className="picker-group-head">
              <span className={`jrny-objective-pill obj-${objective}`}>
                {objectiveLabels[objective]}
              </span>
              <span className="picker-group-count">{group.length}</span>
            </div>
            <div className="picker-grid">
              {group.map((p) => {
                const j = getJourney(p.id)
                const cur = j ? currentJourneyRating(j) : 0
                const tgt = j ? targetJourneyRating(j) : 5
                const pct = j
                  ? Math.min(100, Math.round((j.classesCompleted / j.projection.totalClasses) * 100))
                  : 0
                return (
                  <button type="button" className="picker-card" key={p.id} onClick={() => open(p.id)}>
                    <span className="picker-avatar" aria-hidden="true">
                      {p.name.slice(0, 1)}
                    </span>
                    <span className="picker-card-body">
                      <span className="picker-card-name">{p.name}</span>
                      <span className="picker-card-meta">
                        Age {p.age} · {ageGroupLabel(p.band)}
                      </span>
                      <span className="picker-card-rating">
                        Level {cur.toFixed(1)} <span className="picker-card-target">/ {tgt.toFixed(1)}</span>
                      </span>
                      <span className="picker-card-track">
                        <span className="picker-card-fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="picker-card-progress">{pct}% through the plan</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
