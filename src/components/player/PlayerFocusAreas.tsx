import type { Band, Journey } from '../../types'
import { metricDef } from '../../data/definitions'
import { skillGaps } from '../../data/journeyDerive'

interface Props {
  journey: Journey
  band: Band
}

export default function PlayerFocusAreas({ journey, band }: Props) {
  const focus = skillGaps(journey)
    .filter((g) => g.gap > 0)
    .slice(0, 3)

  if (focus.length === 0) {
    return (
      <section className="card">
        <h2>What to work on most</h2>
        <p className="section-subtitle">Every skill is at or above its goal — great place to be.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>What to work on most</h2>
      <p className="section-subtitle">Practise these first.</p>
      <div className="focus-list">
        {focus.map((g, i) => {
          const def = metricDef(band, g.metricKey)
          return (
            <div className="focus-card" key={g.metricKey}>
              <span className="focus-rank">{i + 1}</span>
              <div className="focus-body">
                <div className="focus-header">
                  <span className="focus-name">{def?.label ?? g.metricKey}</span>
                  <span className="focus-score">
                    {g.current.toFixed(1)} → {g.target.toFixed(1)}
                  </span>
                </div>
                {def && <p className="focus-tip">{def.improvementTip}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
