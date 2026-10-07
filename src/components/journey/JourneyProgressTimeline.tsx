import type { Band, Journey } from '../../types'
import { metricLabel } from '../../data/definitions'
import { formatDate } from '../../utils/format'

interface Props {
  journey: Journey
  band: Band
}

export default function JourneyProgressTimeline({ journey, band }: Props) {
  const entries = [...journey.progressLog].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <section className="card">
      <h2>All updates</h2>
      <p className="section-subtitle">
        Every update from the coach — classes done and where the skills moved.
      </p>
      {entries.length === 0 ? (
        <p className="jrny-empty">
          No updates yet. A coach adds these from the Coach portal.
        </p>
      ) : (
        <ol className="jrny-log">
          {entries.map((e) => {
            const moved = Object.entries(e.scores)
            return (
              <li key={e.id} className="jrny-log-item">
                <div className="jrny-log-head">
                  <span className="jrny-log-date">{formatDate(e.date)}</span>
                  <span className="jrny-log-classes">{e.classesCompleted} classes done</span>
                </div>
                <p className="jrny-log-note">{e.coachNote}</p>
                {moved.length > 0 && (
                  <div className="jrny-log-scores">
                    {moved.map(([k, v]) => (
                      <span className="jrny-score-chip" key={k}>
                        {metricLabel(band, k)} <strong>{v.toFixed(1)}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
