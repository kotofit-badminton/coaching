import type { Journey } from '../../types'
import { capabilityLine } from '../../data/journeyTemplates'

interface Props {
  journey: Journey
  subjectName?: string
}

export default function JourneyProjection({ journey, subjectName = 'They' }: Props) {
  const { projection: p, classesCompleted, targetSummary, phases } = journey
  const pct = Math.min(100, Math.round((classesCompleted / p.totalClasses) * 100))
  const them = subjectName === 'They' ? 'they' : subjectName
  const finishDate = new Date(`${p.targetDate}T00:00:00`)

  return (
    <section className="card jrny-projection">
      <div className="jrny-projection-head">
        <h2>Where this plan is headed</h2>
      </div>
      <p className="jrny-target-summary">{targetSummary}</p>

      <div className="review-stats jrny-projection-stats">
        <div className="review-stat">
          <span className="review-stat-value">~{p.totalClasses}</span>
          <span className="review-stat-label">Classes in all</span>
        </div>
        <div className="review-stat">
          <span className="review-stat-value">{p.classesPerWeek}×</span>
          <span className="review-stat-label">A week</span>
        </div>
        <div className="review-stat">
          <span className="review-stat-value">~{p.estimatedWeeks}</span>
          <span className="review-stat-label">Weeks</span>
        </div>
        <div className="review-stat">
          <span className="review-stat-value">
            {finishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            <span className="review-stat-sub">, {finishDate.getFullYear()}</span>
          </span>
          <span className="review-stat-label">Finish around</span>
        </div>
      </div>

      <div className="jrny-projection-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-label">
          {classesCompleted} of ~{p.totalClasses} classes done · {pct}% there
        </div>
      </div>

      {phases.length > 0 && (
        <div className="jrny-outcomes">
          <h3 className="jrny-outcomes-title">The road ahead — what {them} will be able to do</h3>
          <p className="jrny-outcomes-intro">
            {phases.length} steps over about {p.estimatedWeeks} weeks. Each one ends with a
            real thing {them} can do on court.
          </p>
          <ol className="jrny-steps">
            {phases.map((ph, i) => {
              const done = classesCompleted >= ph.endClass
              const isCurrent =
                !done && (i === 0 || classesCompleted >= phases[i - 1].endClass)
              const status = done ? 'done' : isCurrent ? 'current' : 'upcoming'
              const stepClasses = ph.endClass - ph.startClass + 1
              const stepPct = Math.min(
                100,
                Math.max(
                  0,
                  Math.round(((classesCompleted - ph.startClass + 1) / stepClasses) * 100),
                ),
              )
              return (
                <li
                  key={ph.name}
                  className={`jrny-step ${status}`}
                >
                  <div className="jrny-step-rail">
                    <span className="jrny-step-num">{done ? '✓' : i + 1}</span>
                  </div>
                  <div className="jrny-step-body">
                    <div className="jrny-step-top">
                      <span className="jrny-step-when">
                        Weeks {ph.startWeek}–{ph.endWeek}
                      </span>
                      {status === 'current' && (
                        <span className="jrny-step-badge current">You're here</span>
                      )}
                      {status === 'done' && <span className="jrny-step-badge done">Done</span>}
                    </div>
                    <div className="jrny-step-title">{ph.milestoneLabel}</div>
                    <p className="jrny-step-text">
                      {capabilityLine(subjectName, ph.capability, done)}
                    </p>
                    {status === 'current' && (
                      <div className="jrny-step-track">
                        <div className="jrny-step-fill" style={{ width: `${stepPct}%` }} />
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </section>
  )
}
