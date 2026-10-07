import { useMemo, useState } from 'react'
import { useStore } from '../../data/store'
import { formatDate } from '../../utils/format'
import NoteForm from './NoteForm'
import Section from '../Section'
import { TODAY_INDEX, calendarMonths, todayIso } from '../../utils/calendar'

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  playerId: string
  playerName: string
  /** Who is writing — fixes the note author (no picker). */
  as?: 'player' | 'coach'
}

export default function PlayerDiary({ playerId, playerName, as = 'player' }: Props) {
  const { sessionNotes } = useStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const today = useMemo(() => todayIso(), [])

  const notes = useMemo(
    () =>
      sessionNotes
        .filter((n) => n.playerId === playerId)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [sessionNotes, playerId],
  )

  const byDate = useMemo(() => {
    const m = new Map<string, typeof notes>()
    for (const n of notes) {
      const list = m.get(n.date) ?? []
      list.push(n)
      m.set(n.date, list)
    }
    return m
  }, [notes])

  const months = useMemo(() => calendarMonths(today), [today])
  const [monthIndex, setMonthIndex] = useState(TODAY_INDEX)
  const mo = months[monthIndex]

  const dayNotes = selected ? byDate.get(selected) ?? [] : []

  function pick(iso: string) {
    setSelected(iso)
    setAdding(false)
  }

  return (
    <Section
      title="Diary"
      subtitle={as === 'coach'
        ? `Pick a day to read ${playerName}'s notes or add one of your own.`
        : `A note for any day — you write how a session felt, your coach adds what happened and what's next. Pick a day to read or add.`}
    >

      <div className="cal-legend">
        <span className="cal-legend-item">
          <span className="cal-note-dot" /> Has a note
        </span>
        <span className="cal-legend-item">
          <span className="cal-dot upcoming" /> Today
        </span>
      </div>

      {mo && (
        <div className="cal-month">
          <div className="cal-nav">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => setMonthIndex((i) => i - 1)}
              disabled={monthIndex === 0}
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="cal-month-title">
              {MONTH_NAMES[mo.month]} {mo.year}
            </div>
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => setMonthIndex((i) => i + 1)}
              disabled={monthIndex === months.length - 1}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className="cal-grid">
              {WEEKDAY_LABELS.map((d, i) => (
                <span className="cal-weekday" key={i}>
                  {d}
                </span>
              ))}
              {mo.cells.map((day, i) => {
                if (day == null) return <span className="cal-cell empty" key={i} />
                const iso = `${mo.key}-${String(day).padStart(2, '0')}`
                const has = byDate.has(iso)
                const isToday = iso === today
                const isSel = iso === selected
                return (
                  <button
                    key={i}
                    type="button"
                    className={`cal-cell cal-day${has ? ' has-note' : ''}${
                      isToday ? ' is-today' : ''
                    }${isSel ? ' sel' : ''}`}
                    onClick={() => pick(iso)}
                  >
                    {day}
                    {has && <span className="cal-day-dot" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
        </div>
      )}

      {selected && (
        <div className="diary-day">
          <div className="diary-day-head">
            <h3>{formatDate(selected)}</h3>
            <button
              type="button"
              className="reset-btn"
              onClick={() => setAdding((a) => !a)}
              aria-expanded={adding}
            >
              {adding ? 'Close' : '＋ Add a note'}
            </button>
          </div>

          {adding && (
            <NoteForm
              playerId={playerId}
              playerName={playerName}
              date={selected}
              defaultAuthor={as}
              lockAuthor
              onDone={() => setAdding(false)}
            />
          )}

          {dayNotes.length === 0 && !adding ? (
            <p className="jrny-empty">No notes for this day yet.</p>
          ) : (
            <div className="notes-list">
              {dayNotes.map((n) => (
                <div className="note-item" key={n.id}>
                  <div className="note-header">
                    <span className={`clip-tag note-author-${n.author}`}>
                      {n.author === 'coach' ? 'Coach' : playerName}
                    </span>
                    {n.focus && <span className="diary-focus-tag">{n.focus}</span>}
                  </div>
                  <p className="note-text">{n.note}</p>
                  {n.author === 'coach' && (n.energy || n.soreness) && (
                    <p className="note-rating">
                      {n.energy && `Energy: ${n.energy}`}
                      {n.energy && n.soreness ? ' · ' : ''}
                      {n.soreness && `Soreness: ${n.soreness}`}
                    </p>
                  )}
                  {n.author === 'player' && n.kidRating != null && (
                    <p className="note-rating">Felt like a {n.kidRating}/5</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selected && notes.length > 0 && (
        <p className="section-subtitle diary-hint">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} so far — the most recent was{' '}
          {formatDate(notes[0].date)}.
        </p>
      )}
    </Section>
  )
}
