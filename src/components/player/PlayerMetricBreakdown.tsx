import type { Band, Journey } from '../../types'
import { metricDef } from '../../data/definitions'
import { skillDeltaVsLast } from '../../data/journeyDerive'
import { PLAIN_SKILLS } from '../../data/skillPlain'
import SkillIcon from '../icons/SkillIcon'
import Section from '../Section'

interface Props {
  journey: Journey
  band: Band
}

export default function PlayerMetricBreakdown({ journey, band }: Props) {
  return (
    <Section
      title="Every skill"
      subtitle={
        <>
          How strong each skill is now, and how it has grown since the last update. Tap a
          skill to see what each level means.
        </>
      }
    >
      <div className="metric-grid">
        {journey.skillTargets.map((t) => {
          const def = metricDef(band, t.metricKey)
          const plain = PLAIN_SKILLS[t.metricKey]
          const name = plain?.name ?? def?.label ?? t.metricKey
          const delta = skillDeltaVsLast(journey, t.metricKey)
          const level = Math.min(5, Math.max(1, Math.round(t.current)))
          const filled = level
          return (
            <div className="metric-card skill-visual" key={t.metricKey}>
              <div className="skill-visual-top">
                {plain?.image ? (
                  <img className="skill-visual-photo" src={plain.image} alt="" aria-hidden="true" />
                ) : (
                  plain && (
                    <span className="skill-visual-icon">
                      <SkillIcon icon={plain.icon} />
                    </span>
                  )
                )}
                <div className="skill-visual-name">
                  <span className="metric-label">{name}</span>
                  {plain && <span className="skill-visual-meaning">{plain.meaning}</span>}
                </div>
              </div>

              <div className="skill-visual-level">
                <span className="stroke-dots">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      tabIndex={0}
                      className={`stroke-dot${i <= filled ? ' on' : ''}`}
                      aria-label={`Level ${i}: ${def?.anchors[i as 1 | 2 | 3 | 4 | 5] ?? ''}`}
                    >
                      <span className="stroke-dot-tip" role="tooltip">
                        <strong>Level {i}</strong>
                        {def?.anchors[i as 1 | 2 | 3 | 4 | 5]}
                      </span>
                    </span>
                  ))}
                </span>
              </div>
              {def && (
                <p className="skill-visual-now">
                  <strong>Level {filled} of 5:</strong> {def.anchors[level as 1 | 2 | 3 | 4 | 5]}
                </p>
              )}


              {delta !== 0 && (
                <p className={`metric-delta ${delta > 0 ? 'positive' : 'negative'}`}>
                  {delta > 0 ? 'Improved a little since last time' : 'Dipped a little since last time'}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
