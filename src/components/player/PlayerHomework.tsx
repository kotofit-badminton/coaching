import { useMemo, useState } from 'react'
import type { Band, Journey } from '../../types'
import { metricDef } from '../../data/definitions'
import { skillGaps } from '../../data/journeyDerive'
import Section from '../Section'

interface Props {
  journey: Journey
  band: Band
}

export default function PlayerHomework({ journey, band }: Props) {
  const tasks = useMemo(() => {
    const gaps = skillGaps(journey).filter((g) => g.gap > 0).slice(0, 4)
    return gaps.map((g) => {
      const def = metricDef(band, g.metricKey)
      return {
        id: g.metricKey,
        title: `Work on ${def?.label ?? g.metricKey}`,
        detail: def?.improvementTip ?? 'Practice this skill between sessions.',
      }
    })
  }, [journey.id, journey.classesCompleted, band])

  const [done, setDone] = useState<Record<string, boolean>>({})
  const doneCount = tasks.filter((t) => done[t.id]).length

  if (tasks.length === 0) {
    return (
      <Section title="At-home practice" subtitle="Nothing outstanding — every tracked skill is on target." />
    )
  }

  return (
    <Section
      title="At-home practice"
      subtitle={`${doneCount} of ${tasks.length} done — picked from the skills that need the most work. Tap to check off.`}
    >
      <div className="homework-list">
        {tasks.map((task) => {
          const isDone = Boolean(done[task.id])
          return (
            <button
              type="button"
              key={task.id}
              className={`homework-item${isDone ? ' done' : ''}`}
              onClick={() => setDone((d) => ({ ...d, [task.id]: !d[task.id] }))}
              aria-pressed={isDone}
            >
              <span className={`homework-checkbox${isDone ? ' checked' : ''}`} aria-hidden="true">
                {isDone && '✓'}
              </span>
              <span className="homework-body">
                <span className="homework-title">{task.title}</span>
                <span className="homework-detail">{task.detail}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Section>
  )
}
