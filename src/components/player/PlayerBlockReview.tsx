import type { Journey, Player } from '../../types'
import { lastBlockDelta, nextCheckpoint, skillGaps } from '../../data/journeyDerive'
import Section from '../Section'

interface Props {
  player: Player
  journey: Journey
}

// Plain-language focus for each skill, so a parent doesn't need the sport's terms.
const PLAIN_FOCUS: Record<string, string> = {
  sixCornerFootwork: 'moving quickly around the court',
  staminaEndurance: 'keeping their energy up for a whole session',
  liveRallyLength: 'keeping rallies going',
  serveAccuracy: 'getting serves into the right spot',
  serveConsistency: 'getting serves over the net',
  cornerAccuracy: 'hitting the shuttle to the corners',
  shotSelection: 'choosing the right shot',
  matchPerformance: 'playing well in matches',
  racketShuttleControl: 'keeping the shuttle under control',
  fedRallyConsistency: 'keeping a rally going',
  directionalMovement: 'moving to the shuttle',
  reactionCoordination: 'reacting quickly',
  focusCoachability: 'listening and putting feedback into practice',
  speed: 'getting to the shuttle quickly',
  power: 'hitting with more pace',
}

export default function PlayerBlockReview({ player, journey }: Props) {
  const delta = lastBlockDelta(journey)
  const topGap = skillGaps(journey)[0]
  const next = nextCheckpoint(journey)

  const change =
    delta == null || delta === 0
      ? 'has held steady since the last update'
      : delta > 0
        ? 'has improved since the last update'
        : 'has had a slightly harder stretch since the last update'

  const focus = topGap ? PLAIN_FOCUS[topGap.metricKey] ?? 'building up their skills' : null

  return (
    <Section title="Latest update" className="review-card">
      <p className="review-summary">
        {player.name} {change}.
        {focus && (
          <>
            {' '}
            Next, they are working on <strong>{focus}</strong>.
          </>
        )}
        {next && (
          <>
            {' '}
            The next milestone is <strong>{next.label.toLowerCase()}</strong>.
          </>
        )}
      </p>
    </Section>
  )
}
