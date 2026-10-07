import { useEffect, useMemo, useState } from 'react'
import type { Journey } from '../../types'
import { formatDate } from '../../utils/format'
import { journeyClassDates } from '../../data/journeyDerive'
import Section from '../Section'
import { TODAY_INDEX, calendarMonths, todayIso } from '../../utils/calendar'

interface Props {
  journey: Journey
}

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function monthKey(iso: string) {
  return iso.slice(0, 7)
}

export default function PlayerAttendance({ journey }: Props) {
  const classDays = useMemo(() => journeyClassDates(journey), [journey])
  const byDate = useMemo(
    () => new Map(classDays.map((c) => [c.date, c.status])),
    [classDays],
  )

  const today = useMemo(() => todayIso(), [])
  const months = useMemo(() => calendarMonths(today), [today])

  // one row per Monday-starting week, built from the real class dates
  const weekRows = useMemo(() => {
    const map = new Map<string, typeof classDays>()
    for (const c of classDays) {
      const d = new Date(`${c.date}T00:00:00`)
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      map.set(key, [...(map.get(key) ?? []), c])
    }
    return Array.from(map, ([key, days]) => ({ key, days }))
  }, [classDays])

  const doneCount = journey.classesCompleted
  const nextClass = classDays.find((c) => c.status === 'upcoming')

  const startIndex = useMemo(() => {
    const target = monthKey(nextClass?.date ?? today)
    const i = months.findIndex((m) => m.key === target)
    return i >= 0 ? i : TODAY_INDEX
  }, [months, nextClass, today])
  const [monthIndex, setMonthIndex] = useState(startIndex)

  // reopen on the right month when another player is picked
  useEffect(() => setMonthIndex(startIndex), [startIndex])

  const mo = months[monthIndex]

  const attendedWeeks = weekRows.filter((w) => w.days.some((d) => d.status === 'done')).length

  return (
    <Section
      title="Attendance"
      subtitle={
        <>
          The days {journey.classesCompleted > 0 ? 'trained so far' : 'planned'} and the ones
          still to come. Filled days are done; outlined days are booked in. So far that's{' '}
          <strong>{doneCount}</strong> of {journey.projection.totalClasses} classes across{' '}
          {attendedWeeks} {attendedWeeks === 1 ? 'week' : 'weeks'}
          {nextClass && (
            <>
              , and the next one is <strong>{formatDate(nextClass.date)}</strong>
            </>
          )}
          .
        </>
      }
    >

      <div className="cal-legend">
        <span className="cal-legend-item">
          <span className="cal-dot done" /> Trained
        </span>
        <span className="cal-legend-item">
          <span className="cal-dot upcoming" /> Booked in
        </span>
      </div>

      <div className="cal-layout">
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
              const status = byDate.get(iso)
              return (
                <span
                  key={i}
                  className={`cal-cell${status ? ` has-class ${status}` : ''}`}
                  title={status ? `${formatDate(iso)} — ${status === 'done' ? 'trained' : 'booked in'}` : undefined}
                >
                  {day}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="cal-weeks-block">
        <div className="cal-chart-title">Week by week</div>
        <ol className="cal-weeks">
          {weekRows.map((w) => (
            <li className="cal-week" key={w.key}>
              <span className="cal-week-label">{formatDate(w.key)}</span>
              <span className="cal-week-dots">
                {w.days.map((c) => (
                  <span
                    key={c.date}
                    className={`cal-week-dot ${c.status}`}
                    title={`${formatDate(c.date)} — ${c.status === 'done' ? 'trained' : 'booked in'}`}
                  />
                ))}
              </span>
            </li>
          ))}
        </ol>
      </div>
      </div>
    </Section>
  )
}
