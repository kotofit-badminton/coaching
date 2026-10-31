import type { Band, Journey } from '../../types'
import { levelWord, metricDef } from '../../data/definitions'
import { GENERAL_SKILLS, GROUP_LABELS, STROKES, type SkillGroup } from '../../data/strokes'
import Section from '../Section'

interface Props {
  journey: Journey
  band: Band
}

function levelOf(journey: Journey, metricKeys: string[]): number | null {
  if (metricKeys.length === 0) return null
  const target = journey.skillTargets.find((t) => metricKeys.includes(t.metricKey))
  return target ? target.current : null
}

function Level({ value, metricKeys, band }: { value: number | null; metricKeys: string[]; band: Band }) {
  const filled = value == null ? 0 : Math.round(value)
  const def = metricKeys.length > 0 ? metricDef(band, metricKeys[0]) : undefined
  return (
    <div className="stroke-level">
      <span className="stroke-dots">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            tabIndex={def ? 0 : -1}
            className={`stroke-dot${i <= filled ? ' on' : ''}`}
          >
            {def && (
              <span className="stroke-dot-tip" role="tooltip">
                <strong>Level {i}</strong>
                {def.anchors[i as 1 | 2 | 3 | 4 | 5]}
              </span>
            )}
          </span>
        ))}
      </span>
      <span>{value == null ? 'Not measured yet' : levelWord(value)}</span>
    </div>
  )
}

const GROUP_ORDER: SkillGroup[] = ['shots', 'movement', 'fitness', 'game', 'mindset']

export default function StrokeCards({ journey, band }: Props) {
  const skills = GENERAL_SKILLS.map((s) => ({ ...s, value: levelOf(journey, s.metricKeys) }))
  const bySkill = new Map(skills.map((s) => [s.id, s]))

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
                  <Level value={skill?.value ?? null} metricKeys={skill?.metricKeys ?? []} band={band} />
                </div>
              </article>
            )
          })}
        </div>
        <div className="stroke-grid stroke-grid-small">
          {skills
            .filter((s) => s.group === 'shots')
            .map((skill) => (
              <article className="stroke-card" key={skill.id}>
                {skill.image && (
                  <img className="stroke-img" src={skill.image} alt={skill.name} loading="lazy" />
                )}
                <div className="stroke-body">
                  <h3 className="stroke-name">{skill.name}</h3>
                  <Level value={skill.value} metricKeys={skill.metricKeys} band={band} />
                </div>
              </article>
            ))}
        </div>
      </Section>

      {GROUP_ORDER.filter((g) => g !== 'shots').map((group) => {
        const items = skills.filter((s) => s.group === group)
        if (items.length === 0) return null
        return (
          <Section title={GROUP_LABELS[group]} key={group}>
            <div className="stroke-grid stroke-grid-small">
              {items.map((skill) => (
                <article className="stroke-card" key={skill.id}>
                  {skill.image && (
                    <img className="stroke-img" src={skill.image} alt={skill.name} loading="lazy" />
                  )}
                  <div className="stroke-body">
                    <h3 className="stroke-name">{skill.name}</h3>
                    <Level value={skill.value} metricKeys={skill.metricKeys} band={band} />
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )
      })}
    </>
  )
}
