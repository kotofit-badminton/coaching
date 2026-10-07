import type { Journey, JourneyCheckpoint, JourneyPhaseInfo, WeeklyPlanItem } from '../types'

const round1 = (n: number) => Math.round(n * 10) / 10
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/** Simple journey rating = average of the tracked skills' current scores (1–5). */
export function currentJourneyRating(journey: Journey): number {
  return round1(mean(journey.skillTargets.map((t) => t.current)))
}

export function baselineJourneyRating(journey: Journey): number {
  return round1(mean(journey.skillTargets.map((t) => t.baseline)))
}

export function targetJourneyRating(journey: Journey): number {
  return round1(mean(journey.skillTargets.map((t) => t.target)))
}

export interface RatingPoint {
  date: string
  rating: number
  classesCompleted: number
  label: string
}

/**
 * Rating over time: the onboarding baseline, then one point per logged progress
 * entry (each skill carried forward from the last entry that scored it).
 */
export function journeyRatingSeries(journey: Journey): RatingPoint[] {
  const keys = journey.skillTargets.map((t) => t.metricKey)
  const running: Record<string, number> = Object.fromEntries(
    journey.skillTargets.map((t) => [t.metricKey, t.baseline]),
  )

  const points: RatingPoint[] = [
    {
      date: journey.projection.startDate,
      rating: baselineJourneyRating(journey),
      classesCompleted: 0,
      label: 'Onboarding',
    },
  ]

  const log = [...journey.progressLog].sort((a, b) => (a.date < b.date ? -1 : 1))
  for (const entry of log) {
    for (const k of keys) {
      if (entry.scores[k] != null) running[k] = entry.scores[k]
    }
    points.push({
      date: entry.date,
      rating: round1(mean(keys.map((k) => running[k]))),
      classesCompleted: entry.classesCompleted,
      label: `${entry.classesCompleted} classes`,
    })
  }
  return points
}

/** Which programme week the player is in, from classes completed. */
export function currentWeekNumber(journey: Journey): number {
  const perWeek = Math.max(1, journey.projection.classesPerWeek)
  const wk = Math.floor(journey.classesCompleted / perWeek) + 1
  return Math.min(Math.max(wk, 1), journey.projection.estimatedWeeks || 1)
}

export function currentWeekPlan(journey: Journey): WeeklyPlanItem | undefined {
  const wk = currentWeekNumber(journey)
  return journey.weeklyPlan.find((w) => w.week === wk) ?? journey.weeklyPlan[0]
}

/** The phase the player is in right now. */
export function currentPhase(journey: Journey): JourneyPhaseInfo | undefined {
  if (!journey.phases?.length) return undefined
  const wk = currentWeekNumber(journey)
  return (
    journey.phases.find((p) => wk >= p.startWeek && wk <= p.endWeek) ?? journey.phases[0]
  )
}

export function nextCheckpoint(journey: Journey): JourneyCheckpoint | undefined {
  return journey.checkpoints.find((c) => !c.done)
}

export function completedCheckpoints(journey: Journey): JourneyCheckpoint[] {
  return journey.checkpoints.filter((c) => c.done)
}

/** Delta in journey rating between the last two progress entries. */
export function lastBlockDelta(journey: Journey): number | null {
  const series = journeyRatingSeries(journey)
  if (series.length < 2) return null
  return round1(series[series.length - 1].rating - series[series.length - 2].rating)
}

/** One tracked skill's value at each check-in (baseline first, then carried forward). */
export function skillSeries(journey: Journey, metricKey: string): number[] {
  const target = journey.skillTargets.find((t) => t.metricKey === metricKey)
  if (!target) return []
  const out = [target.baseline]
  let running = target.baseline
  const log = [...journey.progressLog].sort((a, b) => (a.date < b.date ? -1 : 1))
  for (const entry of log) {
    if (entry.scores[metricKey] != null) running = entry.scores[metricKey]
    out.push(running)
  }
  return out
}

/** Change in a tracked skill between the last two check-ins. */
export function skillDeltaVsLast(journey: Journey, metricKey: string): number {
  const s = skillSeries(journey, metricKey)
  if (s.length < 2) return 0
  return round1(s[s.length - 1] - s[s.length - 2])
}

export interface SkillGap {
  metricKey: string
  current: number
  target: number
  gap: number
}

/** Tracked skills ranked by how far they still are from target (largest gap first). */
export function skillGaps(journey: Journey): SkillGap[] {
  return journey.skillTargets
    .map((t) => ({
      metricKey: t.metricKey,
      current: t.current,
      target: t.target,
      gap: round1(Math.max(0, t.target - t.current)),
    }))
    .sort((a, b) => b.gap - a.gap)
}

export interface AttendanceWeek {
  key: string
  count: number
  label: string
}

/**
 * A plausible weekly attendance history: fill each week from the journey start
 * with `classesPerWeek` sessions until `classesCompleted` runs out.
 */
export function syntheticAttendance(journey: Journey): AttendanceWeek[] {
  const perWeek = Math.max(1, journey.projection.classesPerWeek)
  const weeksNeeded = Math.max(1, Math.ceil(journey.classesCompleted / perWeek))
  let remaining = journey.classesCompleted
  const start = new Date(`${journey.projection.startDate}T00:00:00`)
  const offset = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - offset)

  const weeks: AttendanceWeek[] = []
  let cursorMonth = -1
  for (let i = 0; i < Math.max(weeksNeeded, journey.projection.estimatedWeeks); i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i * 7)
    const count = Math.max(0, Math.min(perWeek, remaining))
    remaining -= count
    const month = d.getMonth()
    const firstOfMonth = month !== cursorMonth
    if (firstOfMonth) cursorMonth = month
    weeks.push({
      key: d.toISOString().slice(0, 10),
      count,
      label: firstOfMonth ? d.toLocaleDateString('en-US', { month: 'short' }) : '',
    })
    if (i + 1 >= weeksNeeded && i + 1 >= journey.projection.estimatedWeeks) break
  }
  return weeks
}

const CLASS_WEEKDAYS: Record<number, number[]> = {
  1: [6], // Saturday
  2: [2, 6], // Tuesday, Saturday
  3: [1, 3, 6], // Monday, Wednesday, Saturday
}

export interface ClassDay {
  date: string // ISO
  status: 'done' | 'upcoming'
}

/**
 * Actual class dates for the plan: from the start date, on the plan's regular
 * training weekdays, for as many classes as the plan has. The first
 * `classesCompleted` are marked done, the rest upcoming.
 */
export function journeyClassDates(journey: Journey): ClassDay[] {
  const perWeek = Math.min(3, Math.max(1, journey.projection.classesPerWeek))
  const weekdays = CLASS_WEEKDAYS[perWeek] ?? [2, 6]
  const total = journey.projection.totalClasses
  const cur = new Date(`${journey.projection.startDate}T00:00:00`)
  const out: ClassDay[] = []
  let guard = 0
  while (out.length < total && guard < 4000) {
    if (weekdays.includes(cur.getDay())) {
      out.push({
        date: cur.toISOString().slice(0, 10),
        status: out.length < journey.classesCompleted ? 'done' : 'upcoming',
      })
    }
    cur.setDate(cur.getDate() + 1)
    guard++
  }
  return out
}

/** Index into drillPath the player is "on" now, by fraction of classes done. */
export function drillPathCursor(journey: Journey): number {
  const { totalClasses } = journey.projection
  const frac = totalClasses ? journey.classesCompleted / totalClasses : 0
  return Math.min(
    journey.drillPath.length - 1,
    Math.floor(frac * journey.drillPath.length),
  )
}
