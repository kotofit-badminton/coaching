interface ICSEventOptions {
  title: string
  description: string
  dateISO: string
  startHour?: number // 24h local hour the session starts, default 4pm
  durationMinutes?: number
  filename?: string
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toICSDateTime(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  )
}

export function downloadICSEvent({
  title,
  description,
  dateISO,
  startHour = 16,
  durationMinutes = 60,
  filename = 'kotofit-session.ics',
}: ICSEventOptions) {
  const start = new Date(`${dateISO}T${pad(startHour)}:00:00`)
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  const now = new Date()

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KotoFit//Player Journey//EN',
    'BEGIN:VEVENT',
    `UID:${now.getTime()}@kotofit.app`,
    `DTSTAMP:${toICSDateTime(now)}`,
    `DTSTART:${toICSDateTime(start)}`,
    `DTEND:${toICSDateTime(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\r?\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const ics = lines.join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
