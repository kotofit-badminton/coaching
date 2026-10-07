import JourneyOverview from './JourneyOverview'
import MonthInReview from './MonthInReview'
import RatingTrend from './RatingTrend'
import AttendanceChart from './AttendanceChart'
import MetricBreakdown from './MetricBreakdown'
import FocusAreas from './FocusAreas'
import Drills from './Drills'
import NextSessionPlan from './NextSessionPlan'
import Homework from './Homework'
import Milestones from './Milestones'
import MediaJournal from './MediaJournal'
import CoachClips from './CoachClips'
import CoachNotes from './CoachNotes'
import DigitalDiary from './DigitalDiary'
import Goals from './Goals'
import Matches from './Matches'
import { bandDefinitions } from '../data/bandDefinitions'
import { assessments, milestones, player } from '../data/seed'
import { currentStreak, sessionNotes } from '../data/sessionNotes'
import { goals } from '../data/goals'
import { matches } from '../data/matches'
import { drills } from '../data/drills'
import { nextSessionPlan } from '../data/nextSessionPlan'
import { homeworkTasks } from '../data/homework'
import { coachClips } from '../data/coachClips'

/**
 * The original parent dashboard, kept intact as supporting detail beneath the
 * journey. Seeded for the sample player (Vikram).
 */
export default function SupportingDashboard() {
  const bandDef = bandDefinitions[player.band]

  return (
    <>
      <div id="overview">
        <JourneyOverview
          player={player}
          assessments={assessments}
          sessionCount={sessionNotes.length}
          streakWeeks={currentStreak}
        />
      </div>
      <div id="review">
        <MonthInReview
          player={player}
          assessments={assessments}
          bandDef={bandDef}
          milestones={milestones}
          streakWeeks={currentStreak}
        />
      </div>
      <div id="rating">
        <RatingTrend assessments={assessments} playerName={player.name} />
      </div>
      <div id="attendance">
        <AttendanceChart sessionNotes={sessionNotes} joinDate={player.joinDate} />
      </div>
      <div id="metrics">
        <MetricBreakdown bandDef={bandDef} assessments={assessments} />
      </div>
      <div id="focus">
        <FocusAreas bandDef={bandDef} assessments={assessments} />
      </div>
      <div id="drills">
        <Drills drills={drills} />
      </div>
      <div id="next-session">
        <NextSessionPlan
          plan={nextSessionPlan}
          bandDef={bandDef}
          assessments={assessments}
          drills={drills}
          playerName={player.name}
        />
      </div>
      <div id="homework">
        <Homework tasks={homeworkTasks} bandDef={bandDef} />
      </div>
      <div id="goals">
        <Goals goals={goals} bandDef={bandDef} />
      </div>
      <div id="matches">
        <Matches matches={matches} />
      </div>
      <div id="milestones">
        <Milestones milestones={milestones} />
      </div>
      <div id="diary">
        <DigitalDiary sessionNotes={sessionNotes} />
      </div>
      <div id="media">
        <MediaJournal assessments={assessments} />
      </div>
      <div id="clips">
        <CoachClips clips={coachClips} bandDef={bandDef} />
      </div>
      <div id="notes">
        <CoachNotes assessments={assessments} />
      </div>
    </>
  )
}
