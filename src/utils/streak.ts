function mondayOfWeek(dateIso: string): string {
  const d = new Date(`${dateIso}T00:00:00`)
  const offsetFromMonday = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - offsetFromMonday)
  return d.toISOString().slice(0, 10)
}

/** Consecutive weeks (ending at the most recent session) with at least one session. */
export function currentStreakWeeks(sessionDates: string[]): number {
  const weekStarts = Array.from(new Set(sessionDates.map(mondayOfWeek))).sort()
  if (weekStarts.length === 0) return 0

  let streak = 1
  for (let i = weekStarts.length - 1; i > 0; i--) {
    const cur = new Date(`${weekStarts[i]}T00:00:00`)
    const prev = new Date(`${weekStarts[i - 1]}T00:00:00`)
    const diffDays = (cur.getTime() - prev.getTime()) / 86_400_000
    if (diffDays === 7) {
      streak++
    } else {
      break
    }
  }
  return streak
}
