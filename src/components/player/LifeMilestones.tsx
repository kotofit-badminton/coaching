import type { Journey, Player } from '../../types'
import { formatDate } from '../../utils/format'
import Section from '../Section'

interface Props {
  player: Player
  journey: Journey
}

interface Milestone {
  id: string
  label: string
  date: string | null
  reached: boolean
}

function addMonths(iso: string, months: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setMonth(d.getMonth() + months)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Whole-journey timeline: from joining to today, plus the next few anniversaries.
export default function LifeMilestones({ player, journey }: Props) {
  const today = new Date()
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const log = journey.progressLog

  const reachedOn = (atClass: number) => log.find((e) => e.classesCompleted >= atClass)?.date ?? null

  const items: Milestone[] = [
    { id: 'joined', label: 'Joined KotoFit', date: player.joinDate, reached: true },
    ...(reachedOn(1)
      ? [{ id: 'first-class', label: 'First class', date: reachedOn(1), reached: true }]
      : []),
    ...journey.checkpoints.map((c) => {
      const date = reachedOn(c.atClass)
      return { id: `cp-${c.atWeek}-${c.atClass}`, label: c.label, date, reached: date != null }
    }),
    ...[3, 6, 12].map((m) => {
      const date = addMonths(player.joinDate, m)
      return { id: `anniv-${m}`, label: `${m} months training`, date, reached: date <= todayIso }
    }),
  ]

  return (
    <Section title="Milestones" subtitle="Everything reached since joining, and what is coming up.">
      <ol className="life-milestones">
        {items.map((m) => (
          <li key={m.id} className={`life-milestone ${m.reached ? 'reached' : 'upcoming'}`}>
            <span className="life-milestone-dot" aria-hidden="true" />
            <span className="life-milestone-label">{m.label}</span>
            <span className="life-milestone-date">
              {m.reached && m.date ? formatDate(m.date) : m.date ? `Coming ${formatDate(m.date)}` : ''}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  )
}
