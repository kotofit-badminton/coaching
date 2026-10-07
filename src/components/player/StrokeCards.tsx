import type { Journey } from '../../types'
import { levelWord } from '../../data/definitions'
import { GENERAL_SKILLS, STROKES } from '../../data/strokes'
import Section from '../Section'

interface Props {
  journey: Journey
}

// Physical skills sit under "Body". Everything else general sits under "Shots".
const BODY_SKILLS = ['stamina', 'footwork', 'speed', 'power']

function levelOf(journey: Journey, metricKeys: string[]): number | null {
  const target = journey.skillTargets.find((t) => metricKeys.includes(t.metricKey))
  return target ? target.current : null
}

function Level({ value }: { value: number | null }) {
  const filled = value == null ? 0 : Math.round(value)
  return (
    <div className="stroke-level">
      <span className="stroke-dots" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`stroke-dot${i <= filled ? ' on' : ''}`} />
        ))}
      </span>
      <span>{value == null ? 'Not measured yet' : levelWord(value)}</span>
    </div>
  )
}

export default function StrokeCards({ journey }: Props) {
  const skills = GENERAL_SKILLS.map((s) => ({ ...s, value: levelOf(journey, s.metricKeys) }))
  const bySkill = new Map(skills.map((s) => [s.id, s]))
  const shotSkills = skills.filter((s) => !BODY_SKILLS.includes(s.id))
  const bodySkills = skills.filter((s) => BODY_SKILLS.includes(s.id))

  return (
    <>
      <Section title="Shots">
        <div className="stroke-grid">
          {STROKES.map((stroke) => {
            const skill = bySkill.get(stroke.skill)
            return (
              <article className="stroke-card" key={stroke.id}>
                {stroke.image ? (
                  <img className="stroke-img" src={stroke.image} alt={stroke.name} loading="lazy" />
                ) : (
                  <div className="stroke-img stroke-placeholder" aria-label={`${stroke.name} photo coming soon`}>
                    {stroke.name}
                  </div>
                )}
                <div className="stroke-body">
                  <h3 className="stroke-name">{stroke.name}</h3>
                  <p className="stroke-what">{stroke.what}</p>
                  <Level value={skill?.value ?? null} />
                </div>
              </article>
            )
          })}
        </div>
        <div className="stroke-grid stroke-grid-small">
          {shotSkills.map((skill) => (
            <article className="stroke-card" key={skill.id}>
              <div className="stroke-body">
                <h3 className="stroke-name">{skill.name}</h3>
                <Level value={skill.value} />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Body">
        <div className="stroke-grid stroke-grid-small">
          {bodySkills.map((skill) => (
            <article className="stroke-card" key={skill.id}>
              <div className="stroke-body">
                <h3 className="stroke-name">{skill.name}</h3>
                <Level value={skill.value} />
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
