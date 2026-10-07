export const MONTHS_BACK = 12
export const MONTHS_FORWARD = 3
export const TODAY_INDEX = MONTHS_BACK

export function todayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export interface CalendarMonth {
  key: string
  year: number
  month: number
  cells: (number | null)[]
}

// one year back, the current month, and three months forward
export function calendarMonths(todayIso: string): CalendarMonth[] {
  const [y, m] = todayIso.slice(0, 7).split('-').map(Number)
  const out: CalendarMonth[] = []
  for (let offset = -MONTHS_BACK; offset <= MONTHS_FORWARD; offset++) {
    const first = new Date(y, m - 1 + offset, 1)
    const year = first.getFullYear()
    const month = first.getMonth()
    const startCol = (first.getDay() + 6) % 7 // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = []
    for (let i = 0; i < startCol; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    out.push({ key: `${year}-${String(month + 1).padStart(2, '0')}`, year, month, cells })
  }
  return out
}
