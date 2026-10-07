import { Link } from 'react-router-dom'
import type { Band, Journey, Objective } from '../../types'
import { useStore } from '../../data/store'
import { objectiveBlurbs, objectiveLabels } from '../../data/journeyTemplates'
import { ageGroupLabel } from '../../data/definitions'

const OBJECTIVES: Objective[] = ['fun', 'fitness', 'competitive']
const BANDS: Band[] = ['A', 'B']

export interface ClassPrefill {
  objective: Objective
  band: Band
  memberIds: string[]
  name: string
}

function journeyProgressPct(j: Journey | undefined): number {
  if (!j || j.skillTargets.length === 0) return 0
  const parts = j.skillTargets.map((t) => {
    const span = Math.max(0.1, t.target - t.baseline)
    return Math.min(1, Math.max(0, (t.current - t.baseline) / span))
  })
  return Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100)
}

interface Props {
  onCreateClassFromGroup: (prefill: ClassPrefill) => void
}

export default function ObjectiveGroups({ onCreateClassFromGroup }: Props) {
  const { players, getJourney } = useStore()

  return (
    <div className="admin-groups">
      <p className="section-subtitle">
        The roster grouped by what each family is here for, then by age band — the natural
        unit for a class.
      </p>

      {OBJECTIVES.map((objective) => {
        const inObjective = players.filter((p) => p.objective === objective)
        return (
          <div className="admin-objective-block" key={objective}>
            <div className="admin-objective-title">
              <span className={`jrny-objective-pill obj-${objective}`}>
                {objectiveLabels[objective]}
              </span>
              <span className="admin-objective-count">{inObjective.length} players</span>
              <span className="admin-objective-blurb">{objectiveBlurbs[objective]}</span>
            </div>

            <div className="admin-group-grid">
              {BANDS.map((band) => {
                const members = inObjective.filter((p) => p.band === band)
                if (members.length === 0) return null
                return (
                  <div className="admin-group-card" key={band}>
                    <div className="admin-group-head">
                      <span className="admin-group-name">
                        {objectiveLabels[objective]} · {ageGroupLabel(band)}
                      </span>
                      <button
                        type="button"
                        className="admin-mini-btn"
                        onClick={() =>
                          onCreateClassFromGroup({
                            objective,
                            band,
                            memberIds: members.map((m) => m.id),
                            name: `${objectiveLabels[objective]} · ${ageGroupLabel(band)}`,
                          })
                        }
                      >
                        Create class from group
                      </button>
                    </div>
                    <ul className="admin-group-members">
                      {members.map((m) => {
                        const j = getJourney(m.id)
                        return (
                          <li key={m.id}>
                            <Link to={`/player/${m.id}`} className="admin-member-link">
                              <span className="admin-member-name">{m.name}</span>
                              <span className="admin-member-meta">
                                age {m.age} · {j ? `${j.classesCompleted} classes` : 'no journey'}
                              </span>
                            </Link>
                            <div className="admin-member-track">
                              <div
                                className="admin-member-fill"
                                style={{ width: `${journeyProgressPct(j)}%` }}
                              />
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
