import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'
import type { Assessment, BandDefinition } from '../types'
import InfoPopover from './InfoPopover'

interface Props {
  bandDef: BandDefinition
  assessments: Assessment[]
}

export default function MetricBreakdown({ bandDef, assessments }: Props) {
  const latest = assessments[assessments.length - 1]
  const previous = assessments[assessments.length - 2]

  return (
    <section className="card">
      <h2>Metric breakdown</h2>
      <p className="section-subtitle">
        Current scores per headline metric, weighted into the overall rating
      </p>
      <div className="metric-grid">
        {bandDef.metrics.map((metric) => {
          const score = latest.metricScores[metric.key]
          const prevScore = previous?.metricScores[metric.key]
          const delta = prevScore !== undefined ? score - prevScore : 0
          const trendData = assessments.map((a) => ({
            value: a.metricScores[metric.key],
          }))
          const currentLevel = Math.min(5, Math.max(1, Math.round(score))) as 1 | 2 | 3 | 4 | 5
          const anchorLabel = metric.anchors[currentLevel]

          return (
            <div className="metric-card" key={metric.key}>
              <div className="metric-card-header">
                <span className="metric-label-group">
                  <span className="metric-label">{metric.label}</span>
                  <InfoPopover label={`What does the ${metric.label} score mean?`}>
                    <div className="rubric-popover-title">{metric.label}</div>
                    {([1, 2, 3, 4, 5] as const).map((level) => (
                      <div
                        key={level}
                        className={`rubric-row${currentLevel === level ? ' active' : ''}`}
                      >
                        <span className="rubric-row-level">{level}</span>
                        <span className="rubric-row-text">{metric.anchors[level]}</span>
                      </div>
                    ))}
                  </InfoPopover>
                </span>
                <span className="metric-weight">{Math.round(metric.weight * 100)}%</span>
              </div>
              <div className="metric-card-body">
                <div className="metric-score">
                  {score.toFixed(1)}
                  <span className="metric-score-max">/5</span>
                </div>
                <div className="metric-sparkline">
                  <ResponsiveContainer width="100%" height={36}>
                    <LineChart data={trendData}>
                      <YAxis domain={[1, 5]} hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {prevScore !== undefined && delta !== 0 && (
                <div className={`metric-delta ${delta > 0 ? 'positive' : 'negative'}`}>
                  {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} vs. last check-in
                </div>
              )}
              <p className="metric-anchor">{anchorLabel}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
