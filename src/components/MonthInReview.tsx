import type { Assessment, BandDefinition, Milestone, Player } from '../types'

interface Props {
  player: Player
  assessments: Assessment[]
  bandDef: BandDefinition
  milestones: Milestone[]
  streakWeeks: number
}

export default function MonthInReview({
  player,
  assessments,
  bandDef,
  milestones,
  streakWeeks,
}: Props) {
  const latest = assessments[assessments.length - 1]
  const previous = assessments[assessments.length - 2]
  const delta = previous
    ? Math.round((latest.computedOverallRating - previous.computedOverallRating) * 10) / 10
    : 0

  const lowestMetric = bandDef.metrics
    .map((metric) => ({ metric, score: latest.metricScores[metric.key] }))
    .sort((a, b) => a.score - b.score)[0]

  const closestMilestone = milestones
    .filter((m) => !m.unlockedDate && m.progress)
    .map((m) => ({ milestone: m, pct: m.progress!.current / m.progress!.target }))
    .sort((a, b) => b.pct - a.pct)[0]

  return (
    <section className="card review-card">
      <h2>This month in review</h2>
      <p className="review-summary">
        {player.name}'s overall rating {delta >= 0 ? 'climbed' : 'dipped'} to{' '}
        <strong>{latest.computedOverallRating.toFixed(1)}/5</strong>
        {previous && (
          <>
            {' '}
            ({delta >= 0 ? '+' : ''}
            {delta.toFixed(1)} from last check-in)
          </>
        )}
        , riding a <strong>{streakWeeks}-week training streak</strong>. The next area to focus on
        is <strong>{lowestMetric.metric.label}</strong> ({lowestMetric.score.toFixed(1)}/5)
        {closestMilestone && (
          <>
            {' '}
            — and <strong>{closestMilestone.milestone.title}</strong> is the closest badge to
            unlocking, at {Math.round(closestMilestone.pct * 100)}% there.
          </>
        )}
      </p>

      <div className="review-stats">
        <div className="review-stat">
          <span className={`review-stat-value ${delta >= 0 ? 'positive' : 'negative'}`}>
            {delta >= 0 ? '+' : ''}
            {delta.toFixed(1)}
          </span>
          <span className="review-stat-label">Rating change</span>
        </div>
        <div className="review-stat">
          <span className="review-stat-value">{streakWeeks}</span>
          <span className="review-stat-label">Week streak</span>
        </div>
        <div className="review-stat">
          <span className="review-stat-value review-stat-text">{lowestMetric.metric.label}</span>
          <span className="review-stat-label">Top focus</span>
        </div>
        {closestMilestone && (
          <div className="review-stat">
            <span className="review-stat-value">{Math.round(closestMilestone.pct * 100)}%</span>
            <span className="review-stat-label">Closest badge</span>
          </div>
        )}
      </div>
    </section>
  )
}
