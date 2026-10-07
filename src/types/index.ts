export type Band = 'A' | 'B'

/** What the family wants out of coaching. Drives the whole journey. */
export type Objective = 'fun' | 'fitness' | 'competitive'

export interface Player {
  id: string
  name: string
  age: number
  band: Band
  objective: Objective
  joinDate: string // ISO date
  photoUrl: string
}

export interface MediaItem {
  type: 'photo' | 'video'
  url: string
  caption: string
}

export interface Assessment {
  id: string
  playerId: string
  date: string // ISO date
  metricScores: Record<string, number> // metric key -> 1-5
  computedOverallRating: number
  coachNotes: string
  media: MediaItem[]
}

export type MilestoneTriggerType = 'time' | 'rating' | 'skill'

export type MilestoneIconKey =
  | 'rally'
  | 'match'
  | 'anniversary'
  | 'smash'
  | 'star'
  | 'trophy'
  | 'target'

export interface Milestone {
  id: string
  playerId: string
  title: string
  triggerType: MilestoneTriggerType
  unlockedDate: string | null // null = not yet unlocked (in progress)
  badgeIcon: MilestoneIconKey
  description: string
  progress?: { current: number; target: number; unit: string } // for in-progress milestones
}

export type NoteAuthor = 'coach' | 'player'
export type EnergyLevel = 'low' | 'medium' | 'high'
export type SorenessLevel = 'none' | 'mild' | 'moderate'

export interface SessionNote {
  id: string
  playerId: string
  date: string // ISO date
  author: NoteAuthor
  authorName: string
  focus: string // short session topic, e.g. "Serve accuracy drills"
  note: string
  energy?: EnergyLevel // coach-observed wellness, coach-authored entries only
  soreness?: SorenessLevel
  kidRating?: number // 1-5 self-rating — how the session felt, player-authored entries only
}

export type GoalPeriod = 'weekly' | 'monthly'
export type GoalStatus = 'in_progress' | 'completed'

export interface Goal {
  id: string
  playerId: string
  period: GoalPeriod
  title: string
  description: string
  startDate: string // ISO date
  endDate: string // ISO date
  status: GoalStatus
  metricKey?: string // optional link to a headline metric
  progress?: { current: number; target: number; unit: string }
}

export type MatchType = 'friendly' | 'tournament'
export type MatchResult = 'win' | 'loss'

export interface MatchGame {
  playerScore: number
  opponentScore: number
}

export interface Match {
  id: string
  playerId: string
  type: MatchType
  date: string // ISO date
  opponentName: string
  eventName?: string // tournament/league name, e.g. "Jersey City Junior Open"
  result: MatchResult
  games: MatchGame[]
  notes: string
}

export interface MetricDefinition {
  key: string
  label: string
  weight: number // fraction, sums to 1 within a band
  // Rubric anchors for every point on the 1-5 scale. 1/3/5 are the spec's
  // primary anchors; 2/4 are interpolated midpoints for parent legibility.
  anchors: { 1: string; 2: string; 3: string; 4: string; 5: string }
  improvementTip: string // actionable coaching tip shown in Focus areas
}

export interface DrillRating {
  date: string // ISO date
  score: number // 1-5
  notes: string
}

export interface Drill {
  id: string
  playerId: string
  name: string
  category: string
  description: string
  ratings: DrillRating[] // chronological, most recent last
}

export interface BandDefinition {
  band: Band
  label: string
  ageRange: string
  focus: string
  metrics: MetricDefinition[]
}

export interface SessionPlan {
  date: string // ISO date of the next scheduled session
  coachNote: string
}

export type HomeworkStatus = 'done' | 'pending'

export interface HomeworkTask {
  id: string
  title: string
  detail: string
  assignedDate: string // ISO date
  dueDate: string // ISO date
  metricKey?: string
  status: HomeworkStatus
}

export interface CoachClip {
  id: string
  title: string
  date: string // ISO date
  durationSeconds: number
  metricKey?: string
  transcript: string
}

// ---------------------------------------------------------------------------
// Objective-driven journeys
// ---------------------------------------------------------------------------

/** The registration evaluation that a journey is created from. */
export interface OnboardingEvaluation {
  id: string
  playerId: string
  date: string // ISO date
  coachName: string // "Self-registered" for the questionnaire flow
  band: Band
  objective: Objective
  baselineScores: Record<string, number> // that band's headline metric keys -> 1-5
  notes: string
  quizAnswers?: Record<string, string> // questionId -> optionId, when self-registered
}

/** A drill in the shared library (no per-player ratings — see Drill for that). */
export interface DrillTemplate {
  id: string
  name: string
  category: string
  description: string
}

/** One headline metric, from where the kid started to where the journey aims. */
export interface SkillTarget {
  metricKey: string
  baseline: number // 1-5 at onboarding
  current: number // 1-5 now (moves as progress is logged)
  target: number // 1-5 the journey aims for
  classesToTarget: number // classes needed to close the gap at this objective's pace
}

/** How demanding a phase's sessions are — a key difference between objectives. */
export type Intensity = 'light' | 'moderate' | 'high'

export interface WeeklyPlanItem {
  week: number
  phase: string // name of the phase this week belongs to
  intensity: Intensity
  focusMetricKeys: string[]
  drillIds: string[] // DrillTemplate ids
  summary: string
}

export interface JourneyCheckpoint {
  atClass: number // fires around this many classes completed
  atWeek: number // end of the phase this checkpoint closes
  label: string // short achievement name, e.g. "First 15-shot tactical rally"
  capability: string // what the player can do now, e.g. "You can build and win 15+ shot rallies…"
  phaseName: string
  done: boolean
}

/** A stage of the journey — a run of weeks with one theme and one capability payoff. */
export interface JourneyPhaseInfo {
  name: string
  intensity: Intensity
  startWeek: number
  endWeek: number
  startClass: number
  endClass: number
  focusMetricKeys: string[]
  milestoneLabel: string
  capability: string
}

export interface JourneyProjection {
  totalClasses: number
  classesPerWeek: number
  estimatedWeeks: number
  startDate: string // ISO date
  targetDate: string // ISO date
}

export interface JourneyProgressEntry {
  id: string
  date: string // ISO date
  classesCompleted: number // cumulative classes attended as of this entry
  scores: Record<string, number> // updated metric scores
  coachNote: string
}

export interface Journey {
  id: string
  playerId: string
  objective: Objective
  band: Band
  createdDate: string // ISO date
  targetSummary: string
  skillTargets: SkillTarget[]
  projection: JourneyProjection
  drillPath: string[] // DrillTemplate ids, ordered
  weeklyPlan: WeeklyPlanItem[]
  phases: JourneyPhaseInfo[]
  checkpoints: JourneyCheckpoint[]
  progressLog: JourneyProgressEntry[]
  classesCompleted: number // convenience: latest cumulative from progressLog
}

/** One authored stage in a template: a theme, its drills, and the capability it unlocks. */
export interface JourneyPhaseTemplate {
  name: string
  weight: number // relative share of the journey's weeks
  intensity: Intensity
  focusMetricKeys: string[]
  drillIds: string[]
  weekSummaries: string[] // cycled across the phase's weeks
  milestoneLabel: string
  capability: string
}

/** Template that a journey is generated from, keyed by objective x band. */
export interface JourneyTemplate {
  targetSummary: string
  skillTargets: { metricKey: string; target: number }[]
  ratePerClass: number // rating points a metric gains per class at this objective's pace
  classesPerWeek: number
  minClasses: number
  phases: JourneyPhaseTemplate[] // journey.drillPath is derived from these
}

/** A short video/audio clip attached to a player, recorded by coach or player. */
export interface Clip {
  id: string
  playerId: string
  author: 'coach' | 'player'
  authorName: string
  title: string
  date: string // ISO
  kind: 'video' | 'audio'
  note: string // what it shows / a transcript
}

export interface CoachingClass {
  id: string
  name: string
  objective: Objective
  band: Band
  coachName: string
  schedule: string
  capacity: number
  memberIds: string[]
}
