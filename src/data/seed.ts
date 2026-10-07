import type { Assessment, Milestone, Player } from '../types'
import { bandDefinitions } from './bandDefinitions'
import { computeOverallRating } from './computeRating'

export const player: Player = {
  id: 'p-vikram',
  name: 'Vikram',
  age: 11,
  band: 'B',
  objective: 'competitive',
  joinDate: '2025-10-15',
  photoUrl: '',
}

const bandDef = bandDefinitions[player.band]

interface RawAssessment {
  date: string
  metricScores: Record<string, number>
  coachNotes: string
  media: Assessment['media']
}

const rawAssessments: RawAssessment[] = [
  {
    date: '2026-03-01',
    metricScores: {
      cornerAccuracy: 2.0,
      serveAccuracy: 2.5,
      liveRallyLength: 2.0,
      shotSelection: 1.5,
      sixCornerFootwork: 2.0,
      staminaEndurance: 2.5,
      matchPerformance: 2.0,
    },
    coachNotes:
      "Vikram is settling into live-rally drills well. Footwork pattern is still tentative on the backhand corners — we'll drill that specifically next session. Great attitude, asks good questions.",
    media: [
      { type: 'photo', url: '', caption: 'Working the 4-corner drill' },
    ],
  },
  {
    date: '2026-04-05',
    metricScores: {
      cornerAccuracy: 2.5,
      serveAccuracy: 2.5,
      liveRallyLength: 2.5,
      shotSelection: 2.0,
      sixCornerFootwork: 2.5,
      staminaEndurance: 3.0,
      matchPerformance: 2.5,
    },
    coachNotes:
      'Noticeable improvement in stamina — holding intensity much longer before the drop-off. Serve is more consistent into the correct half. Still hitting the easy shot by default under pressure.',
    media: [
      { type: 'photo', url: '', caption: 'Serve practice — target zones' },
      { type: 'video', url: '', caption: 'First 8-shot live rally!' },
    ],
  },
  {
    date: '2026-05-03',
    metricScores: {
      cornerAccuracy: 3.0,
      serveAccuracy: 3.0,
      liveRallyLength: 3.0,
      shotSelection: 2.5,
      sixCornerFootwork: 3.0,
      staminaEndurance: 3.0,
      matchPerformance: 3.0,
    },
    coachNotes:
      "Played a first friendly match this month — competed well above what I expected for that rating. Vikram is starting to read where the opponent is standing before choosing a shot, which is exactly the tactical piece we've been building toward.",
    media: [
      { type: 'photo', url: '', caption: 'First friendly match day' },
    ],
  },
  {
    date: '2026-06-07',
    metricScores: {
      cornerAccuracy: 3.0,
      serveAccuracy: 3.5,
      liveRallyLength: 3.5,
      shotSelection: 3.0,
      sixCornerFootwork: 3.5,
      staminaEndurance: 3.5,
      matchPerformance: 3.0,
    },
    coachNotes:
      '6-corner footwork is clicking — clean recovery to center after wide shots. Landed a first clean smash this session, good timing on the overhead. Keep encouraging the disguised drop shot at home.',
    media: [
      { type: 'video', url: '', caption: 'First clean smash on camera' },
    ],
  },
  {
    date: '2026-07-12',
    metricScores: {
      cornerAccuracy: 3.5,
      serveAccuracy: 3.5,
      liveRallyLength: 4.0,
      shotSelection: 3.5,
      sixCornerFootwork: 4.0,
      staminaEndurance: 3.5,
      matchPerformance: 3.5,
    },
    coachNotes:
      "New personal best: sustained a 16-shot rally with placement and shot variety, no unforced errors. Vikram is playing with real confidence now — starting to disguise intent on corner shots rather than telegraphing them.",
    media: [
      { type: 'photo', url: '', caption: 'Post-session, all smiles' },
      { type: 'video', url: '', caption: 'Personal-best 16-shot rally' },
    ],
  },
]

export const assessments: Assessment[] = rawAssessments.map((raw, i) => ({
  id: `a-${i + 1}`,
  playerId: player.id,
  date: raw.date,
  metricScores: raw.metricScores,
  computedOverallRating: computeOverallRating(raw.metricScores, bandDef),
  coachNotes: raw.coachNotes,
  media: raw.media,
}))

const latestRating = assessments[assessments.length - 1].computedOverallRating

export const milestones: Milestone[] = [
  {
    id: 'm-first-rally',
    playerId: player.id,
    title: 'First Live Rally (8+ shots)',
    triggerType: 'skill',
    unlockedDate: '2026-04-05',
    badgeIcon: 'rally',
    description: 'Sustained an 8-shot live rally for the first time.',
  },
  {
    id: 'm-first-match',
    playerId: player.id,
    title: 'First Friendly Match',
    triggerType: 'skill',
    unlockedDate: '2026-05-03',
    badgeIcon: 'match',
    description: 'Played in a first friendly match against another junior.',
  },
  {
    id: 'm-3mo',
    playerId: player.id,
    title: '3-Month Training Anniversary',
    triggerType: 'time',
    unlockedDate: '2026-01-15',
    badgeIcon: 'anniversary',
    description: '3 months of consistent training at KotoFit.',
  },
  {
    id: 'm-first-smash',
    playerId: player.id,
    title: 'First Clean Smash',
    triggerType: 'skill',
    unlockedDate: '2026-06-07',
    badgeIcon: 'smash',
    description: 'Landed a clean, well-timed overhead smash.',
  },
  {
    id: 'm-6mo',
    playerId: player.id,
    title: '6-Month Training Anniversary',
    triggerType: 'time',
    unlockedDate: '2026-04-15',
    badgeIcon: 'anniversary',
    description: '6 months of consistent training at KotoFit.',
  },
  {
    id: 'm-pb-rally',
    playerId: player.id,
    title: 'New Personal-Best Rally',
    triggerType: 'rating',
    unlockedDate: '2026-07-12',
    badgeIcon: 'star',
    description: 'Set a new personal-best live rally length: 16 shots.',
  },
  {
    id: 'm-first-tournament',
    playerId: player.id,
    title: 'First Tournament Match',
    triggerType: 'skill',
    unlockedDate: '2026-07-25',
    badgeIcon: 'trophy',
    description: 'Played in a first official open tournament — Jersey City Junior Open.',
  },
  {
    id: 'm-12mo',
    playerId: player.id,
    title: '12-Month Training Anniversary',
    triggerType: 'time',
    unlockedDate: null,
    badgeIcon: 'trophy',
    description: '12 months of consistent training at KotoFit.',
    progress: { current: 10, target: 12, unit: 'months' },
  },
  {
    id: 'm-overall-4',
    playerId: player.id,
    title: 'Overall Rating 4.0+',
    triggerType: 'rating',
    unlockedDate: null,
    badgeIcon: 'target',
    description: 'Reach an overall rating of 4.0 or higher.',
    progress: { current: latestRating, target: 4.0, unit: 'rating' },
  },
]
