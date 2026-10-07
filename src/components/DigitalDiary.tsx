import { useMemo, useState } from 'react'
import type { SessionNote } from '../types'
import { formatDate } from '../utils/format'

interface Props {
  sessionNotes: SessionNote[]
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export default function DigitalDiary({ sessionNotes }: Props) {
  const notesByDate = useMemo(() => {
    const map = new Map<string, SessionNote[]>()
    for (const note of sessionNotes) {
      const existing = map.get(note.date)
      if (existing) existing.push(note)
      else map.set(note.date, [note])
    }
    return map
  }, [sessionNotes])

  const sortedDates = useMemo(() => sessionNotes.map((n) => n.date).sort(), [sessionNotes])
  const firstDate = sortedDates[0]
  const lastDate = sortedDates[sortedDates.length - 1]

  const initial = lastDate ? new Date(`${lastDate}T00:00:00`) : new Date()
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const minMonthKey = firstDate
    ? monthKey(new Date(`${firstDate}T00:00:00`).getFullYear(), new Date(`${firstDate}T00:00:00`).getMonth())
    : monthKey(viewYear, viewMonth)
  const maxMonthKey = lastDate
    ? monthKey(new Date(`${lastDate}T00:00:00`).getFullYear(), new Date(`${lastDate}T00:00:00`).getMonth())
    : monthKey(viewYear, viewMonth)
  const currentMonthKey = monthKey(viewYear, viewMonth)

  function goToMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const leadingBlanks = firstOfMonth.getDay()

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthLabel = firstOfMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const selectedNotes = selectedDate ? notesByDate.get(selectedDate) ?? [] : []

  return (
    <section className="card">
      <div className="diary-header">
        <div>
          <h2>Digital diary</h2>
          <p className="section-subtitle">
            {sessionNotes.length} session notes logged by coach &amp; player — select a date to
            read
          </p>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-nav">
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => goToMonth(-1)}
            disabled={currentMonthKey <= minMonthKey}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="calendar-month-label">{monthLabel}</span>
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => goToMonth(1)}
            disabled={currentMonthKey >= maxMonthKey}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="calendar-grid calendar-weekdays">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="calendar-weekday">
              {d}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} className="calendar-cell empty" />
            const dateIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayNotes = notesByDate.get(dateIso)
            const hasNote = !!dayNotes?.length
            const hasWellnessDip = dayNotes?.some(
              (n) =>
                n.energy === 'low' ||
                n.soreness === 'moderate' ||
                (n.kidRating !== undefined && n.kidRating <= 2),
            )

            return (
              <button
                type="button"
                key={dateIso}
                className={`calendar-cell${hasNote ? ' has-note' : ''}`}
                disabled={!hasNote}
                onClick={() => setSelectedDate(dateIso)}
              >
                {hasWellnessDip && (
                  <span
                    className="calendar-flag"
                    aria-hidden="true"
                    title="Dip in energy, soreness, or session rating noted"
                  />
                )}
                <span className="calendar-day-num">{day}</span>
                {hasNote && (
                  <span className="calendar-dots">
                    {dayNotes!.map((n) => (
                      <span key={n.id} className={`calendar-dot ${n.author}`} aria-hidden="true" />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="calendar-legend">
          <span>
            <span className="calendar-dot coach" aria-hidden="true" /> Coach note
          </span>
          <span>
            <span className="calendar-dot player" aria-hidden="true" /> Player note
          </span>
          <span>
            <span className="calendar-flag static" aria-hidden="true" /> Notable dip
          </span>
        </div>
      </div>

      {selectedDate && (
        <div className="diary-modal-backdrop" onClick={() => setSelectedDate(null)}>
          <div
            className="diary-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="diary-modal-header">
              <h3>{formatDate(selectedDate)}</h3>
              <button
                type="button"
                className="diary-modal-close"
                onClick={() => setSelectedDate(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {selectedNotes.map((n) => (
              <div className="diary-note" key={n.id}>
                <div className="diary-note-meta">
                  <span className={`diary-author-badge ${n.author}`}>
                    {n.author === 'coach' ? 'Coach' : 'Player'} · {n.authorName}
                  </span>
                  <span className="diary-focus-tag">{n.focus}</span>
                </div>
                <p className="diary-note-text">{n.note}</p>
                {(n.energy || n.soreness || n.kidRating !== undefined) && (
                  <div className="diary-wellness-row">
                    {n.energy && (
                      <span className={`wellness-chip energy-${n.energy}`}>
                        {n.energy === 'high'
                          ? 'High energy'
                          : n.energy === 'medium'
                            ? 'Medium energy'
                            : 'Low energy'}
                      </span>
                    )}
                    {n.soreness && (
                      <span className={`wellness-chip soreness-${n.soreness}`}>
                        {n.soreness === 'none'
                          ? 'No soreness'
                          : n.soreness === 'mild'
                            ? 'Mild soreness'
                            : 'Moderate soreness'}
                      </span>
                    )}
                    {n.kidRating !== undefined && (
                      <span
                        className={`wellness-chip rating-${n.kidRating >= 4 ? 'high' : n.kidRating === 3 ? 'medium' : 'low'}`}
                      >
                        Felt {n.kidRating}/5
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
