import type { Journey } from '../../types'
import { drillTemplateById } from '../../data/drillLibrary'
import { drillPathCursor } from '../../data/journeyDerive'
import Section from '../Section'

interface Props {
  journey: Journey
}

export default function PlayerDrills({ journey }: Props) {
  const cursor = drillPathCursor(journey)

  return (
    <Section
      title="Drills"
      subtitle="The drills for this plan, in order — what's done, what you're on now, and what's ahead."
    >
      <div className="drill-grid">
        {journey.drillPath.map((id, i) => {
          const d = drillTemplateById[id]
          if (!d) return null
          const status = i < cursor ? 'done' : i === cursor ? 'current' : 'upcoming'
          return (
            <div className={`drill-card drill-card-${status}`} key={id}>
              <div className="drill-card-top">
                <span className="drill-category">{d.category}</span>
                <span className={`drill-status drill-status-${status}`}>
                  {status === 'done' ? 'Done' : status === 'current' ? 'On now' : `Step ${i + 1}`}
                </span>
              </div>
              <h3 className="drill-name">{d.name}</h3>
              <p className="drill-desc">{d.description}</p>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
