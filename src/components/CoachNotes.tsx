import type { Assessment } from '../types'
import { formatDate } from '../utils/format'

interface Props {
  assessments: Assessment[]
}

export default function CoachNotes({ assessments }: Props) {
  const notes = assessments.slice().reverse()

  return (
    <section className="card">
      <h2>Coach notes</h2>
      <p className="section-subtitle">Freeform notes from each check-in, most recent first</p>
      <div className="notes-list">
        {notes.map((a) => (
          <div className="note-item" key={a.id}>
            <div className="note-header">
              <span className="note-date">{formatDate(a.date)}</span>
              <span className="note-rating">{a.computedOverallRating.toFixed(1)} / 5</span>
            </div>
            <p className="note-text">{a.coachNotes}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
