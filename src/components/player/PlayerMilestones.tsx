import type { Journey, MilestoneIconKey } from '../../types'
import MilestoneIcon from '../icons/MilestoneIcon'
import { capabilityLine } from '../../data/journeyTemplates'
import Section from '../Section'

interface Props {
  journey: Journey
  subjectName?: string
}

function iconFor(label: string): MilestoneIconKey {
  const l = label.toLowerCase()
  if (l.includes('tournament') || l.includes('ladder')) return 'trophy'
  if (l.includes('match')) return 'match'
  if (l.includes('rally')) return 'rally'
  if (l.includes('rating') || l.includes('dubr')) return 'target'
  if (l.includes('fitness') || l.includes('test')) return 'star'
  if (l.includes('social') || l.includes('friend')) return 'anniversary'
  return 'star'
}

export default function PlayerMilestones({ journey, subjectName = 'They' }: Props) {
  const done = journey.checkpoints.filter((c) => c.done)
  const upcoming = journey.checkpoints.filter((c) => !c.done)

  return (
    <Section
      title={`What ${subjectName === 'They' ? 'they' : subjectName} can do`}
      subtitle="Things reached so far, and what's coming next."
    >

      {upcoming.length > 0 && (
        <div className="milestone-in-progress-list">
          {upcoming.slice(0, 2).map((c) => {
            const pct = Math.min(100, Math.round((journey.classesCompleted / c.atClass) * 100))
            return (
              <div className="milestone-progress-card" key={c.label}>
                <span className={`badge-icon dim ${iconFor(c.label)}`}>
                  <MilestoneIcon icon={iconFor(c.label)} />
                </span>
                <div className="milestone-progress-body">
                  <div className="milestone-title">{c.label}</div>
                  <div className="milestone-desc">
                    {capabilityLine(subjectName, c.capability, false)}
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="progress-label">
                    {journey.classesCompleted} / {c.atClass} classes · end of “{c.phaseName}”
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {done.length > 0 ? (
        <ol className="milestone-timeline">
          {done.map((c) => (
            <li key={c.label}>
              <span className="milestone-item-btn" style={{ cursor: 'default' }}>
                <span className={`badge-icon ${iconFor(c.label)}`}>
                  <MilestoneIcon icon={iconFor(c.label)} />
                </span>
                <span className="milestone-item-text">
                  <span className="milestone-title">{c.label}</span>
                  <span className="milestone-desc">
                    {capabilityLine(subjectName, c.capability, true)}
                  </span>
                </span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="jrny-empty">Nothing reached yet — the first goal is coming up.</p>
      )}
    </Section>
  )
}
