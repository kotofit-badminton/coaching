import type { Assessment, Player } from '../types'
import { bandDefinitions } from '../data/bandDefinitions'
import { formatDate, monthsBetween } from '../utils/format'
import InfoPopover from './InfoPopover'

interface Props {
  player: Player
  assessments: Assessment[]
  sessionCount: number
  streakWeeks: number
}

export default function JourneyOverview({ player, assessments, sessionCount, streakWeeks }: Props) {
  const bandDef = bandDefinitions[player.band]
  const latest = assessments[assessments.length - 1]
  const first = assessments[0]
  const trainingMonths = monthsBetween(player.joinDate, latest.date)
  const delta =
    Math.round((latest.computedOverallRating - first.computedOverallRating) * 10) / 10

  return (
    <section className="card journey-overview">
      <div className="avatar" aria-hidden="true">
        {player.name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </div>
      <div className="journey-overview-body">
        <h1>{player.name}</h1>
        <div className="journey-meta">
          <span>Age {player.age}</span>
          <span aria-hidden="true">·</span>
          <span>
            {bandDef.label} ({bandDef.ageRange})
          </span>
          <span aria-hidden="true">·</span>
          <span>Training since {formatDate(player.joinDate)}</span>
          <span aria-hidden="true">·</span>
          <span>{trainingMonths} months in</span>
          <span aria-hidden="true">·</span>
          <span>{sessionCount} sessions trained</span>
        </div>
        <p className="journey-focus">{bandDef.focus}</p>
        <span className="streak-chip">
          <span aria-hidden="true">🔥</span> {streakWeeks}-week training streak
        </span>
      </div>
      <div className="journey-overview-rating">
        <div className="rating-value">
          {latest.computedOverallRating.toFixed(1)}
          <span className="rating-max">/5</span>
        </div>
        <div className="rating-label">
          Overall rating
          <InfoPopover label="What does the overall rating mean?" align="right">
            <div className="rubric-popover-title">Overall rating</div>
            <p className="rubric-popover-text">
              A weighted average (1–5) of {bandDef.label}'s {bandDef.metrics.length} headline
              metrics, using rubric definitions specific to {bandDef.ageRange}. The same 1–5
              scale is used in every band for parent legibility, but what each number means
              differs — Band A and Band B are scored against separate rubrics.
            </p>
          </InfoPopover>
        </div>
        <div className={`rating-delta ${delta >= 0 ? 'positive' : 'negative'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} since {formatDate(first.date)}
        </div>
      </div>
    </section>
  )
}
