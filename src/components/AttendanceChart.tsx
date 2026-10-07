import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SessionNote } from '../types'
import { formatDate } from '../utils/format'

interface Props {
  sessionNotes: SessionNote[]
  joinDate: string
}

function mondayOfWeek(dateIso: string): Date {
  const d = new Date(`${dateIso}T00:00:00`)
  const offset = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - offset)
  return d
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export default function AttendanceChart({ sessionNotes, joinDate }: Props) {
  const countByWeek = new Map<string, number>()
  for (const note of sessionNotes) {
    const key = toISODate(mondayOfWeek(note.date))
    countByWeek.set(key, (countByWeek.get(key) ?? 0) + 1)
  }

  const lastDate = sessionNotes[sessionNotes.length - 1]?.date ?? joinDate
  const startWeek = mondayOfWeek(joinDate)
  const endWeek = mondayOfWeek(lastDate)

  const weeks: { key: string; count: number; label: string }[] = []
  let cursorMonth = -1
  const cursor = new Date(startWeek)
  while (cursor <= endWeek) {
    const key = toISODate(cursor)
    const month = cursor.getMonth()
    const isFirstWeekOfMonth = month !== cursorMonth
    if (isFirstWeekOfMonth) cursorMonth = month
    weeks.push({
      key,
      count: countByWeek.get(key) ?? 0,
      label: isFirstWeekOfMonth ? cursor.toLocaleDateString('en-US', { month: 'short' }) : '',
    })
    cursor.setDate(cursor.getDate() + 7)
  }

  const attendedWeeks = weeks.filter((w) => w.count > 0).length
  const consistencyPct = Math.round((attendedWeeks / weeks.length) * 100)

  return (
    <section className="card">
      <h2>Attendance</h2>
      <p className="section-subtitle">
        {attendedWeeks} of {weeks.length} weeks trained ({consistencyPct}% consistency) since{' '}
        {formatDate(joinDate)}
      </p>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weeks} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="var(--gridline)" />
            <XAxis
              dataKey="label"
              stroke="var(--border)"
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              domain={[0, 2]}
              ticks={[0, 1, 2]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              width={22}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value} session${value === 1 ? '' : 's'}`,
                'Week of',
              ]}
              labelFormatter={(_, payload) =>
                payload?.[0] ? formatDate(payload[0].payload.key) : ''
              }
              cursor={{ fill: 'var(--surface-sunken)' }}
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: 'var(--shadow-md)',
                fontSize: 13,
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--accent)"
              radius={[2, 2, 0, 0]}
              maxBarSize={8}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
