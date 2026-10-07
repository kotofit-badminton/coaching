import type { Assessment, BandDefinition, Drill, SessionPlan } from '../types'
import { formatDate } from '../utils/format'
import { downloadICSEvent } from '../utils/ics'

interface Props {
  plan: SessionPlan
  bandDef: BandDefinition
  assessments: Assessment[]
  drills: Drill[]
  playerName: string
}

export default function NextSessionPlan({
  plan,
  bandDef,
  assessments,
  drills,
  playerName,
}: Props) {
  const latest = assessments[assessments.length - 1]
  const lowestMetrics = bandDef.metrics
    .map((metric) => ({ metric, score: latest.metricScores[metric.key] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)

  const lowestDrill = drills
    .map((drill) => ({ drill, score: drill.ratings[drill.ratings.length - 1].score }))
    .sort((a, b) => a.score - b.score)[0]

  function handleAddToCalendar() {
    const focusLines = [
      ...lowestMetrics.map(({ metric }) => `Metric: ${metric.label}`),
      ...(lowestDrill ? [`Drill: ${lowestDrill.drill.name}`] : []),
    ]
    downloadICSEvent({
      title: `${playerName} — KotoFit Training`,
      description: [...focusLines, '', plan.coachNote].join('\n'),
      dateISO: plan.date,
      filename: 'kotofit-next-session.ics',
    })
  }

  return (
    <section className="card next-session-card">
      <div className="next-session-header">
        <span className="next-session-eyebrow">Next session</span>
        <h2>{formatDate(plan.date)}</h2>
        <button type="button" className="ics-btn" onClick={handleAddToCalendar}>
          + Add to calendar
        </button>
      </div>
      <p className="section-subtitle">What the coach is planning to focus on</p>

      <ul className="next-session-list">
        {lowestMetrics.map(({ metric }) => (
          <li key={metric.key}>
            <span className="next-session-tag metric">Metric</span>
            {metric.label}
          </li>
        ))}
        {lowestDrill && (
          <li>
            <span className="next-session-tag drill">Drill</span>
            {lowestDrill.drill.name}
          </li>
        )}
      </ul>

      <p className="next-session-note">{plan.coachNote}</p>
    </section>
  )
}
