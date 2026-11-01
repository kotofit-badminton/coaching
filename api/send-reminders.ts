import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

// Days-before-batch-end that should trigger a reminder.
const THRESHOLDS = [14, 7]

interface PlayerRow {
  id: string
  data: { name: string; objective: string }
}

interface JourneyRecordRow {
  player_id: string
  data: { projection: { targetDate: string } }
}

function daysUntil(targetIso: string, todayIso: string): number {
  const target = new Date(`${targetIso}T00:00:00Z`).getTime()
  const today = new Date(`${todayIso}T00:00:00Z`).getTime()
  return Math.round((target - today) / 86_400_000)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only Vercel Cron (or someone with the secret) can trigger this.
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  const toEmail = process.env.REMINDER_TO_EMAIL || gmailUser

  if (!supabaseUrl || !serviceKey || !gmailUser || !gmailPass || !toEmail) {
    res.status(500).json({ error: 'missing required environment variables' })
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const today = new Date().toISOString().slice(0, 10)

  const [{ data: players, error: playersErr }, { data: journeyRecords, error: recordsErr }] =
    await Promise.all([
      supabase.from('players').select('id, data').eq('is_mock', false),
      supabase.from('records').select('player_id, data').eq('kind', 'journey'),
    ])

  if (playersErr || recordsErr) {
    res.status(500).json({ error: (playersErr ?? recordsErr)?.message })
    return
  }

  const playersById = new Map((players as PlayerRow[]).map((p) => [p.id, p.data]))

  const due: { name: string; days: number; targetDate: string }[] = []
  for (const record of journeyRecords as JourneyRecordRow[]) {
    const player = playersById.get(record.player_id)
    const targetDate = record.data?.projection?.targetDate
    if (!player || !targetDate) continue
    const diff = daysUntil(targetDate, today)
    if (THRESHOLDS.includes(diff)) {
      due.push({ name: player.name, days: diff, targetDate })
    }
  }

  const dryRun = req.query.dry === '1'

  if (due.length === 0) {
    res.status(200).json({ sent: false, due: [], dryRun })
    return
  }

  due.sort((a, b) => a.days - b.days)
  const lines = due.map(
    (d) =>
      `${d.name}'s batch ends ${new Date(`${d.targetDate}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${d.days} days away) — renew them.`,
  )
  const subject = `KotoFit: ${due.length} batch${due.length > 1 ? 'es' : ''} ending soon`
  const text = lines.join('\n')

  if (!dryRun) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    })
    await transporter.sendMail({ from: gmailUser, to: toEmail, subject, text })
  }

  res.status(200).json({ sent: !dryRun, dryRun, due })
}
