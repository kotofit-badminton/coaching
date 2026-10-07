import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'
import type { Drill } from '../types'
import { formatDate } from '../utils/format'

interface Props {
  drills: Drill[]
}

export default function Drills({ drills }: Props) {
  return (
    <section className="card">
      <h2>Drills</h2>
      <p className="section-subtitle">
        Popular drills in rotation this training block, with the latest coach rating and notes
      </p>
      <div className="drill-grid">
        {drills.map((drill) => {
          const latest = drill.ratings[drill.ratings.length - 1]
          const previous = drill.ratings[drill.ratings.length - 2]
          const delta = previous ? Math.round((latest.score - previous.score) * 10) / 10 : 0
          const trendData = drill.ratings.map((r) => ({ value: r.score }))

          return (
            <div className="drill-card" key={drill.id}>
              <span className="drill-category">{drill.category}</span>
              <h3 className="drill-name">{drill.name}</h3>
              <p className="drill-desc">{drill.description}</p>

              <div className="metric-card-body">
                <div className="metric-score">
                  {latest.score.toFixed(1)}
                  <span className="metric-score-max">/5</span>
                </div>
                <div className="metric-sparkline">
                  <ResponsiveContainer width="100%" height={36}>
                    <LineChart data={trendData}>
                      <YAxis domain={[1, 5]} hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {previous && delta !== 0 && (
                <div className={`metric-delta ${delta > 0 ? 'positive' : 'negative'}`}>
                  {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} vs. last rating
                </div>
              )}

              <div className="drill-note">
                <span className="drill-note-date">{formatDate(latest.date)}</span>
                <p className="drill-note-text">{latest.notes}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
