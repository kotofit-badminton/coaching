import type { Assessment, BandDefinition } from '../types'

interface Props {
  bandDef: BandDefinition
  assessments: Assessment[]
}

const FOCUS_COUNT = 3

export default function FocusAreas({ bandDef, assessments }: Props) {
  const latest = assessments[assessments.length - 1]
  const ranked = bandDef.metrics
    .map((metric) => ({ metric, score: latest.metricScores[metric.key] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, FOCUS_COUNT)

  return (
    <section className="card">
      <h2>Focus areas</h2>
      <p className="section-subtitle">
        The {FOCUS_COUNT} lowest-scoring metrics from the latest check-in — where to concentrate
        practice next
      </p>
      <div className="focus-list">
        {ranked.map(({ metric, score }, i) => (
          <div className="focus-card" key={metric.key}>
            <span className="focus-rank">{i + 1}</span>
            <div className="focus-body">
              <div className="focus-header">
                <span className="focus-name">{metric.label}</span>
                <span className="focus-score">{score.toFixed(1)}/5</span>
              </div>
              <p className="focus-tip">{metric.improvementTip}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
