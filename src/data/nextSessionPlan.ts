import type { SessionPlan } from '../types'
import { sessionNotes } from './sessionNotes'

const SESSION_WEEKDAYS = [2, 6] // Tuesday, Saturday

function nextSessionDateAfter(dateIso: string): string {
  const d = new Date(`${dateIso}T00:00:00`)
  do {
    d.setDate(d.getDate() + 1)
  } while (!SESSION_WEEKDAYS.includes(d.getDay()))
  return d.toISOString().slice(0, 10)
}

const lastSessionDate = sessionNotes[sessionNotes.length - 1].date

export const nextSessionPlan: SessionPlan = {
  date: nextSessionDateAfter(lastSessionDate),
  coachNote:
    "Building on this month's check-in — corner accuracy and serve placement are the closest to leveling up, so we'll keep drilling those under light pressure. Staying on reaction multi-shuttle too, to build on the reps from last week.",
}
