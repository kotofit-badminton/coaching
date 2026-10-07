import type { Band, Journey } from '../../types'
import { drillTemplateById } from '../../data/drillLibrary'
import { metricLabel } from '../../data/definitions'
import { capabilityPhrase, intensityLabels } from '../../data/journeyTemplates'
import {
  currentPhase,
  currentWeekNumber,
  currentWeekPlan,
  nextCheckpoint,
} from '../../data/journeyDerive'

interface Props {
  journey: Journey
  band: Band
}

export default function PlayerNextUp({ journey, band }: Props) {
  const week = currentWeekNumber(journey)
  const plan = currentWeekPlan(journey)
  const phase = currentPhase(journey)
  const next = nextCheckpoint(journey)

  return (
    <section className="card player-nextup">
      <h2>Next up</h2>
      <p className="section-subtitle">
        Where {journey.classesCompleted > 0 ? 'the plan sits' : 'the plan starts'} right now.
      </p>

      {phase && (
        <div className="player-nextup-phase">
          <span className="player-nextup-phase-name">
            Step: {phase.name}
            <span className={`jmap-intensity int-${phase.intensity}`}>
              {intensityLabels[phase.intensity]}
            </span>
          </span>
          <span className="player-nextup-phase-cap">
            Working toward being able to {capabilityPhrase(phase.capability)}
          </span>
        </div>
      )}

      <div className="player-nextup-week">
        <span className="player-nextup-week-tag">
          Week {week} of {journey.projection.estimatedWeeks}
        </span>
        {plan && (
          <>
            <p className="player-nextup-focus">
              Focus: {plan.focusMetricKeys.map((k) => metricLabel(band, k)).join(' · ')}
            </p>
            <p className="player-nextup-summary">{plan.summary}</p>
            <div className="jrny-week-drills">
              {plan.drillIds.map((id) => (
                <span className="jrny-drill-chip" key={id}>
                  {drillTemplateById[id]?.name ?? id}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {next && (
        <div className="player-nextup-checkpoint">
          <span className="player-nextup-checkpoint-eyebrow">Next goal</span>
          <span className="player-nextup-checkpoint-label">{next.label}</span>
          <span className="player-nextup-checkpoint-at">
            about {Math.max(0, next.atClass - journey.classesCompleted)} classes to go
          </span>
        </div>
      )}
    </section>
  )
}
