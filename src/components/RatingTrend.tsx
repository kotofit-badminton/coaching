import { useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Assessment } from '../types'
import { typicalBandBProgression } from '../data/benchmark'
import { formatDate, formatMonthYear } from '../utils/format'

interface Props {
  assessments: Assessment[]
  playerName: string
}

interface EndLabelProps {
  x?: number
  y?: number
  index?: number
  value?: number
}

export default function RatingTrend({ assessments, playerName }: Props) {
  const [showTable, setShowTable] = useState(false)
  const data = assessments.map((a, i) => ({
    date: a.date,
    label: formatMonthYear(a.date),
    rating: a.computedOverallRating,
    typical: typicalBandBProgression[i],
  }))

  function EndLabel({ x, y, index, value }: EndLabelProps) {
    if (index !== data.length - 1 || x === undefined || y === undefined || value === undefined) {
      return null
    }
    return (
      <text x={x} y={y - 16} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--text)">
        {value.toFixed(1)}
      </text>
    )
  }

  return (
    <section className="card">
      <div className="chart-header">
        <div>
          <h2>Rating trend</h2>
          <p className="section-subtitle">
            Overall rating across coach check-ins, vs. a typical Band B pace
          </p>
        </div>
        <button
          type="button"
          className="chart-toggle-btn"
          onClick={() => setShowTable((s) => !s)}
          aria-pressed={showTable}
        >
          {showTable ? 'View chart' : 'View as table'}
        </button>
      </div>

      {showTable ? (
        <div className="rating-table-wrap">
          <table className="rating-table">
            <thead>
              <tr>
                <th>Check-in date</th>
                <th>Overall rating</th>
                <th>Typical pace</th>
              </tr>
            </thead>
            <tbody>
              {assessments
                .slice()
                .reverse()
                .map((a, i) => {
                  const idx = assessments.length - 1 - i
                  return (
                    <tr key={a.id}>
                      <td>{formatDate(a.date)}</td>
                      <td>{a.computedOverallRating.toFixed(1)} / 5</td>
                      <td>{typicalBandBProgression[idx].toFixed(1)} / 5</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={data} margin={{ top: 20, right: 16, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.16} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--gridline)" />
                <XAxis
                  dataKey="label"
                  stroke="var(--border)"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)} / 5`,
                    name === 'typical' ? 'Typical pace (Band B)' : 'Overall rating',
                  ]}
                  cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    boxShadow: 'var(--shadow-md)',
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="none"
                  fill="url(#ratingFill)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="typical"
                  stroke="var(--text-muted)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--surface)', strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: 'var(--surface)', strokeWidth: 2 }}
                  isAnimationActive={false}
                  label={<EndLabel />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span>
              <span className="legend-swatch solid" aria-hidden="true" /> {playerName}
            </span>
            <span>
              <span className="legend-swatch dashed" aria-hidden="true" /> Typical pace (Band B)
            </span>
          </div>
        </>
      )}
    </section>
  )
}
