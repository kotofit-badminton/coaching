import type { SessionNote } from '../types'
import { player } from './seed'
import { assessments } from './seed'
import { currentStreakWeeks } from '../utils/streak'

const SESSION_WEEKDAYS = [2, 6] // Tuesday, Saturday — 2 sessions/week

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function generateWeekdayDates(startIso: string, endIso: string, weekdays: number[]): string[] {
  const start = new Date(`${startIso}T00:00:00`)
  const end = new Date(`${endIso}T00:00:00`)
  const dates: string[] = []
  const cur = new Date(start)
  while (cur <= end) {
    if (weekdays.includes(cur.getDay())) dates.push(toISODate(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

const focusPool = [
  'Serve accuracy',
  '4-corner footwork',
  'Live rally play',
  'Smash technique',
  'Net play & drop shots',
  'Agility ladder + footwork',
  'Match simulation',
  'Backhand development',
]

const coachTemplates: ((focus: string) => string)[] = [
  (focus) => `Focused on ${focus.toLowerCase()} today. Solid effort, applied corrections quickly.`,
  (focus) => `Session centered on ${focus.toLowerCase()}. Good energy, a little fatigue in the back half.`,
  (focus) => `Ran through ${focus.toLowerCase()} drills. Technique is coming along nicely — keep reinforcing at home.`,
  (focus) => `Worked ${focus.toLowerCase()} for most of the session. Asked good questions, stayed engaged throughout.`,
  (focus) => `${focus} was the focus today. Progress is steady — small consistent gains each week.`,
]

const playerTemplates: ((focus: string) => string)[] = [
  (focus) => `Today we did ${focus.toLowerCase()}. It was hard at first but I got better by the end!`,
  (focus) => `Practiced ${focus.toLowerCase()} — my arm was tired but I liked it.`,
  (focus) => `We worked on ${focus.toLowerCase()} today. I want to practice this more at home.`,
  (focus) => `${focus} today! Felt good, want to keep improving.`,
]

// Mostly good, occasional dips — coach-observed wellness, cycled independently
// of the focus/template pools so dips don't always land on the same session.
const energyPool: NonNullable<SessionNote['energy']>[] = [
  'high',
  'high',
  'medium',
  'high',
  'medium',
  'low',
  'high',
]
const sorenessPool: NonNullable<SessionNote['soreness']>[] = [
  'none',
  'none',
  'mild',
  'none',
  'none',
  'moderate',
  'none',
  'mild',
  'none',
]

// Mostly enjoyed, occasional low day — self-reported by the kid, cycled
// independently so dips don't always land on the same entry.
const kidRatingPool = [5, 4, 5, 5, 3, 4, 5, 2, 4]

// A missed week (family trip) so the current streak is realistic rather than
// trivially equal to the full training tenure.
const SKIPPED_DATES = new Set(['2026-05-26', '2026-05-30'])

const lastAssessmentDate = assessments[assessments.length - 1].date
const sessionDates = generateWeekdayDates(
  player.joinDate,
  lastAssessmentDate,
  SESSION_WEEKDAYS,
).filter((d) => !SKIPPED_DATES.has(d))

export const sessionNotes: SessionNote[] = sessionDates.map((date, i) => {
  const focus = focusPool[i % focusPool.length]
  const isPlayerAuthored = i % 4 === 3
  const author = isPlayerAuthored ? 'player' : 'coach'
  const authorName = isPlayerAuthored ? player.name : 'Coach Priya'
  const templates = isPlayerAuthored ? playerTemplates : coachTemplates
  const note = templates[i % templates.length](focus)

  return {
    id: `s-${i + 1}`,
    playerId: player.id,
    date,
    author,
    authorName,
    focus,
    note,
    ...(author === 'coach'
      ? {
          energy: energyPool[i % energyPool.length],
          soreness: sorenessPool[i % sorenessPool.length],
        }
      : { kidRating: kidRatingPool[i % kidRatingPool.length] }),
  }
})

export const currentStreak = currentStreakWeeks(sessionDates)
