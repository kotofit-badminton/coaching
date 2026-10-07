import type { Band, Journey } from '../../types'
import { metricDef, metricLabel } from '../../data/definitions'
import { PLAIN_SKILLS } from '../../data/skillPlain'
import { levelWord } from '../../data/definitions'
import Section from '../Section'

interface Props {
  journey: Journey
  band: Band
}

export default function SkillTargets({ journey, band }: Props) {
  return (
    <Section title="Your skills">
      <div className="skill-target-list">
        {journey.skillTargets.map((t) => {
          const def = metricDef(band, t.metricKey)
          const plain = PLAIN_SKILLS[t.metricKey]
          const label = plain?.name ?? def?.label ?? metricLabel(band, t.metricKey)
          const span = Math.max(0.1, t.target - t.baseline)
          const donePct = Math.min(100, Math.max(0, Math.round(((t.current - t.baseline) / span) * 100)))
          const reached = t.current >= t.target
          return (
            <div className="skill-target-row" key={t.metricKey}>
              <div className="skill-target-top">
                <span className="skill-target-label">{label}</span>
                <span className="skill-target-word">{levelWord(t.current)}</span>
              </div>
              <div className="skill-target-track">
                <div
                  className={`skill-target-bar${reached ? ' reached' : ''}`}
                  style={{ width: `${donePct}%` }}
                />
              </div>
              {reached && <div className="skill-target-meta"><span className="skill-target-reached">Goal reached</span></div>}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
