import type { Band, Journey } from '../../types'
import JourneyProjection from './JourneyProjection'
import JourneyMap from './JourneyMap'
import SkillTargets from './SkillTargets'
import JourneyProgressTimeline from './JourneyProgressTimeline'

interface Props {
  journey: Journey
  band: Band
  subjectName?: string
  showProgressLog?: boolean
}

/** The full journey read-out, reused by the player page and the register preview. */
export default function JourneyView({
  journey,
  band,
  subjectName = 'They',
  showProgressLog = true,
}: Props) {
  return (
    <div className="jrny-view">
      <JourneyProjection journey={journey} subjectName={subjectName} />
      <JourneyMap journey={journey} band={band} subjectName={subjectName} />
      <SkillTargets journey={journey} band={band} />
      {showProgressLog && <JourneyProgressTimeline journey={journey} band={band} />}
    </div>
  )
}
