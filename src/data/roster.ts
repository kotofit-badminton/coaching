import type {
  Journey,
  JourneyProgressEntry,
  OnboardingEvaluation,
  Objective,
  Player,
} from '../types'
import { addProgressEntry, generateJourney } from './generateJourney'
import { player as vikram } from './seed'

interface RawKid {
  id: string
  name: string
  age: number
  band: 'A' | 'B'
  objective: Objective
  joinDate: string
  coachName: string
  baselineScores: Record<string, number>
  notes: string
  progress?: Omit<JourneyProgressEntry, 'id'>[]
}

const rawKids: RawKid[] = [
  {
    id: vikram.id,
    name: vikram.name,
    age: vikram.age,
    band: 'B',
    objective: 'competitive',
    joinDate: vikram.joinDate,
    coachName: 'Coach Priya',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      cornerAccuracy: 1.5,
      serveAccuracy: 1.5,
      liveRallyLength: 1.5,
      shotSelection: 1.0,
      sixCornerFootwork: 1.5,
      staminaEndurance: 2.0,
      matchPerformance: 1.5,
    },
    notes:
      'Keen, coachable, wants to play tournaments. Movement is raw but athletic. Start on technical fundamentals and footwork.',
    progress: [
      {
        date: '2026-04-05',
        classesCompleted: 8,
        scores: {
          cornerAccuracy: 2.5,
          serveAccuracy: 2.5,
          liveRallyLength: 2.5,
          shotSelection: 2.0,
          sixCornerFootwork: 2.5,
          staminaEndurance: 3.0,
          matchPerformance: 2.5,
        },
        coachNote:
          'Stamina jumped early. Serve landing in the correct half consistently. Still defaults to the easy shot under pressure.',
      },
      {
        date: '2026-05-03',
        classesCompleted: 14,
        scores: {
          cornerAccuracy: 3.0,
          serveAccuracy: 3.0,
          liveRallyLength: 3.0,
          shotSelection: 2.5,
          sixCornerFootwork: 3.0,
          staminaEndurance: 3.0,
          matchPerformance: 3.0,
        },
        coachNote:
          'First friendly match — competed above his rating. Starting to read opponent position before choosing a shot.',
      },
      {
        date: '2026-07-12',
        classesCompleted: 22,
        scores: {
          cornerAccuracy: 3.5,
          serveAccuracy: 3.5,
          liveRallyLength: 4.0,
          shotSelection: 3.5,
          sixCornerFootwork: 4.0,
          staminaEndurance: 3.5,
          matchPerformance: 3.5,
        },
        coachNote:
          'Personal-best 16-shot tactical rally, disguising corners now. Ready for the club ladder.',
      },
    ],
  },
  {
    id: 'p-mia',
    name: 'Mia',
    age: 7,
    band: 'A',
    objective: 'fun',
    joinDate: '2026-05-02',
    coachName: 'Coach Dan',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      racketShuttleControl: 1.5,
      fedRallyConsistency: 1.5,
      serveConsistency: 1.0,
      directionalMovement: 2.0,
      reactionCoordination: 2.0,
      focusCoachability: 2.5,
    },
    notes: 'Here with two friends from school. Loves the games, shy about drills. Keep it playful.',
    progress: [
      {
        date: '2026-06-06',
        classesCompleted: 5,
        scores: {
          racketShuttleControl: 2.0,
          fedRallyConsistency: 2.0,
          serveConsistency: 1.5,
          focusCoachability: 3.0,
        },
        coachNote: 'First 10-shot cooperative rally with a partner — big smile. Much more settled in the group.',
      },
    ],
  },
  {
    id: 'p-leo',
    name: 'Leo',
    age: 6,
    band: 'A',
    objective: 'fitness',
    joinDate: '2026-06-10',
    coachName: 'Coach Dan',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      racketShuttleControl: 1.5,
      fedRallyConsistency: 1.5,
      serveConsistency: 1.5,
      directionalMovement: 2.0,
      reactionCoordination: 1.5,
      focusCoachability: 2.0,
    },
    notes: 'Parents want him active and off screens. Tons of energy, needs structure for it.',
  },
  {
    id: 'p-ava',
    name: 'Ava',
    age: 8,
    band: 'A',
    objective: 'competitive',
    joinDate: '2026-04-20',
    coachName: 'Coach Priya',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      racketShuttleControl: 2.5,
      fedRallyConsistency: 2.5,
      serveConsistency: 2.0,
      directionalMovement: 2.5,
      reactionCoordination: 2.5,
      focusCoachability: 3.0,
    },
    notes: 'Older sibling plays in tournaments; Ava wants the same. Strong focus for her age.',
    progress: [
      {
        date: '2026-06-01',
        classesCompleted: 10,
        scores: {
          racketShuttleControl: 3.0,
          serveConsistency: 2.5,
          directionalMovement: 3.0,
          focusCoachability: 3.5,
        },
        coachNote: 'Clean contact developing fast. Ran a first scored mini-match and kept her composure.',
      },
    ],
  },
  {
    id: 'p-noah',
    name: 'Noah',
    age: 10,
    band: 'B',
    objective: 'fun',
    joinDate: '2026-06-15',
    coachName: 'Coach Dan',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      cornerAccuracy: 2.0,
      serveAccuracy: 2.0,
      liveRallyLength: 2.0,
      shotSelection: 1.5,
      sixCornerFootwork: 2.0,
      staminaEndurance: 2.5,
      matchPerformance: 1.5,
    },
    notes: 'Came with a friend, mostly here for the social side. Happy rallying, not fussed about scoring.',
  },
  {
    id: 'p-sara',
    name: 'Sara',
    age: 9,
    band: 'B',
    objective: 'fun',
    joinDate: '2026-05-18',
    coachName: 'Coach Dan',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      cornerAccuracy: 2.0,
      serveAccuracy: 2.5,
      liveRallyLength: 2.5,
      shotSelection: 2.0,
      sixCornerFootwork: 2.0,
      staminaEndurance: 2.5,
      matchPerformance: 2.0,
    },
    notes: 'Enjoys the group and the mini-matches. Might move to the competitive track later if she wants.',
  },
  {
    id: 'p-zoe',
    name: 'Zoe',
    age: 12,
    band: 'B',
    objective: 'fitness',
    joinDate: '2026-04-28',
    coachName: 'Coach Mara',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      cornerAccuracy: 2.0,
      serveAccuracy: 2.0,
      liveRallyLength: 2.5,
      shotSelection: 2.0,
      sixCornerFootwork: 2.0,
      staminaEndurance: 2.0,
      matchPerformance: 2.0,
    },
    notes: 'Runs cross-country, wants agility and footwork work in the off-season. Very consistent attendance.',
    progress: [
      {
        date: '2026-06-09',
        classesCompleted: 8,
        scores: {
          sixCornerFootwork: 2.75,
          staminaEndurance: 3.0,
          liveRallyLength: 3.0,
        },
        coachNote: 'Footwork-drill time down 12% from baseline. Holding intensity well past the halfway mark now.',
      },
    ],
  },
  {
    id: 'p-kai',
    name: 'Kai',
    age: 11,
    band: 'B',
    objective: 'fitness',
    joinDate: '2026-07-01',
    coachName: 'Coach Mara',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      cornerAccuracy: 2.5,
      serveAccuracy: 2.5,
      liveRallyLength: 2.5,
      shotSelection: 2.5,
      sixCornerFootwork: 2.5,
      staminaEndurance: 2.5,
      matchPerformance: 2.5,
    },
    notes: 'Plays a lot of sports casually. Here to build a conditioning base; open to competitive later.',
  },
  {
    id: 'p-ethan',
    name: 'Ethan',
    age: 13,
    band: 'B',
    objective: 'competitive',
    joinDate: '2026-03-30',
    coachName: 'Coach Priya',
    baselineScores: {
      speed: 2.5,
      power: 2.5,
      cornerAccuracy: 2.5,
      serveAccuracy: 2.5,
      liveRallyLength: 3.0,
      shotSelection: 2.5,
      sixCornerFootwork: 3.0,
      staminaEndurance: 3.0,
      matchPerformance: 2.5,
    },
    notes: 'Played at school for a year. Wants a first sanctioned tournament this season and a DUBR rating.',
    progress: [
      {
        date: '2026-05-04',
        classesCompleted: 8,
        scores: {
          cornerAccuracy: 3.0,
          serveAccuracy: 3.0,
          shotSelection: 3.0,
          matchPerformance: 3.0,
        },
        coachNote: 'Pattern play clicking. First club ladder night went well — won two of three.',
      },
      {
        date: '2026-07-06',
        classesCompleted: 18,
        scores: {
          cornerAccuracy: 3.5,
          serveAccuracy: 3.5,
          liveRallyLength: 3.5,
          shotSelection: 3.5,
          sixCornerFootwork: 3.5,
          staminaEndurance: 3.5,
          matchPerformance: 3.5,
        },
        coachNote: 'Entered for the Jersey City Junior Open. Tournament-prep routine is locked in.',
      },
    ],
  },
]

function buildKid(raw: RawKid): {
  player: Player
  onboarding: OnboardingEvaluation
  journey: Journey
} {
  const player: Player = {
    id: raw.id,
    name: raw.name,
    age: raw.age,
    band: raw.band,
    objective: raw.objective,
    joinDate: raw.joinDate,
    photoUrl: '',
  }

  const onboarding: OnboardingEvaluation = {
    id: `ev-${raw.id}`,
    playerId: raw.id,
    date: raw.joinDate,
    coachName: raw.coachName,
    band: raw.band,
    objective: raw.objective,
    baselineScores: raw.baselineScores,
    notes: raw.notes,
  }

  let journey = generateJourney(onboarding, { id: `jr-${raw.id}` })
  raw.progress?.forEach((entry, i) => {
    journey = addProgressEntry(journey, { id: `jp-${raw.id}-${i + 1}`, ...entry })
  })

  return { player, onboarding, journey }
}

const built = rawKids.map(buildKid)

export const rosterPlayers: Player[] = built.map((b) => b.player)
export const rosterOnboarding: OnboardingEvaluation[] = built.map((b) => b.onboarding)
export const rosterJourneys: Journey[] = built.map((b) => b.journey)
