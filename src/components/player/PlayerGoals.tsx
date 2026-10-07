import type { Band, Journey } from '../../types'
import { formatDate } from '../../utils/format'
import { metricLabel } from '../../data/definitions'
import { currentWeekPlan, nextCheckpoint, skillGaps } from '../../data/journeyDerive'
import { PLAIN_SKILLS } from '../../data/skillPlain'
import Section from '../Section'

interface Props {
  journey: Journey
  band: Band
}

export default function PlayerGoals({ journey, band }: Props) {
  const plan = currentWeekPlan(journey)
  const next = nextCheckpoint(journey)
  const topGap = skillGaps(journey)[0]

  const weeklyPct = topGap
    ? Math.min(100, Math.round((topGap.current / topGap.target) * 100))
    : 0
  const nextPct = next
    ? Math.min(100, Math.round((journey.classesCompleted / next.atClass) * 100))
    : 100

  const focusName = plan?.focusMetricKeys
    .map((k) => PLAIN_SKILLS[k]?.name ?? metricLabel(band, k))
    .join(' and ')
  const topName = topGap ? (PLAIN_SKILLS[topGap.metricKey]?.name ?? metricLabel(band, topGap.metricKey)) : null

  return (
    <Section title="Goals">
      <div className="goal-pair">
        <article className="goal-simple">
          <p className="goal-kicker">This week</p>
          <h3 className="goal-simple-title">{focusName ? `Work on ${focusName.toLowerCase()}` : 'Keep the plan moving'}</h3>
          {plan && <p className="goal-simple-desc">{plan.summary}</p>}
          {topGap && (
            <>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${weeklyPct}%` }} />
              </div>
              <p className="goal-simple-count">
                {topName}: {topGap.current.toFixed(1)} of {topGap.target.toFixed(1)}
              </p>
            </>
          )}
        </article>

        <article className="goal-simple">
          <p className="goal-kicker">Next milestone</p>
          <h3 className="goal-simple-title">{next ? next.label : 'Every milestone reached'}</h3>
          <p className="goal-simple-desc">
            {next ? `Expected around class ${next.atClass}.` : 'Nothing left on this plan.'}
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${nextPct}%` }} />
          </div>
          <p className="goal-simple-count">
            {journey.classesCompleted} of {next ? next.atClass : journey.projection.totalClasses} classes
            {' · '}
            by {formatDate(journey.projection.targetDate)}
          </p>
        </article>
      </div>
    </Section>
  )
}
