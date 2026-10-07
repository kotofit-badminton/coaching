import type { BandDefinition, Goal } from '../types'
import { formatDate } from '../utils/format'

interface Props {
  goals: Goal[]
  bandDef: BandDefinition
}

function GoalCard({ goal, bandDef }: { goal: Goal; bandDef: BandDefinition }) {
  const pct = goal.progress
    ? Math.min(100, Math.round((goal.progress.current / goal.progress.target) * 100))
    : goal.status === 'completed'
      ? 100
      : 0
  const metricLabel = goal.metricKey
    ? bandDef.metrics.find((m) => m.key === goal.metricKey)?.label
    : undefined

  return (
    <div className={`goal-card ${goal.status}`}>
      <div className="goal-card-header">
        <span className="goal-title">{goal.title}</span>
        <span className={`goal-status-badge ${goal.status}`}>
          {goal.status === 'completed' ? '✓ Completed' : 'In progress'}
        </span>
      </div>
      <p className="goal-desc">{goal.description}</p>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="goal-footer">
        {goal.progress && (
          <span className="goal-progress-label">
            {goal.progress.current} / {goal.progress.target} {goal.progress.unit}
          </span>
        )}
        <span className="goal-dates">
          {formatDate(goal.startDate)} – {formatDate(goal.endDate)}
        </span>
      </div>
      {metricLabel && <span className="goal-metric-tag">Linked to {metricLabel}</span>}
    </div>
  )
}

export default function Goals({ goals, bandDef }: Props) {
  const weekly = goals.filter((g) => g.period === 'weekly')
  const monthly = goals.filter((g) => g.period === 'monthly')

  return (
    <section className="card">
      <h2>Training goals</h2>
      <p className="section-subtitle">Weekly and monthly targets set with the coach</p>

      <div className="goals-group">
        <h3 className="goals-group-title">This week</h3>
        <div className="goals-list">
          {weekly.map((g) => (
            <GoalCard goal={g} bandDef={bandDef} key={g.id} />
          ))}
        </div>
      </div>

      <div className="goals-group">
        <h3 className="goals-group-title">This month</h3>
        <div className="goals-list">
          {monthly.map((g) => (
            <GoalCard goal={g} bandDef={bandDef} key={g.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
