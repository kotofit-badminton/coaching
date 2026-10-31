import { useState } from 'react'
import type { Band, Journey } from '../../types'
import { metricLabel } from '../../data/definitions'
import { PLAIN_SKILLS } from '../../data/skillPlain'
import { formatDate } from '../../utils/format'
import Section from '../Section'

interface Props {
  journey: Journey
  band: Band
}

const SHOWN = 3

function UpdateRow({
  date,
  classes,
  note,
  moved,
  band,
}: {
  date: string
  classes: number
  note: string
  moved: [string, number][]
  band: Band
}) {
  const [open, setOpen] = useState(false)
  const shown = open ? moved : moved.slice(0, SHOWN)
  const more = moved.length - SHOWN

  return (
    <li className="update-row">
      <div className="update-row-top">
        <span className="update-row-date">{formatDate(date)}</span>
        <span className="update-row-classes">{classes} classes</span>
      </div>
      <p className="update-row-note">{note}</p>
      {moved.length > 0 && (
        <div className="update-row-skills">
          {shown.map(([k, v]) => (
            <span className="update-chip" key={k}>
              {PLAIN_SKILLS[k]?.name ?? metricLabel(band, k)} <strong>{v.toFixed(1)}</strong>
            </span>
          ))}
          {more > 0 && (
            <button type="button" className="update-more" onClick={() => setOpen((o) => !o)}>
              {open ? 'Show less' : `+${more} more`}
            </button>
          )}
        </div>
      )}
    </li>
  )
}

export default function JourneyProgressTimeline({ journey, band }: Props) {
  const entries = [...journey.progressLog].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <Section title="Coach updates" subtitle="What was covered, and what moved.">
      {entries.length === 0 ? (
        <p className="jrny-empty">No updates yet. A coach adds these from the Coach portal.</p>
      ) : (
        <ol className="update-list">
          {entries.map((e) => (
            <UpdateRow
              key={e.id}
              date={e.date}
              classes={e.classesCompleted}
              note={e.coachNote}
              moved={Object.entries(e.scores)}
              band={band}
            />
          ))}
        </ol>
      )}
    </Section>
  )
}
