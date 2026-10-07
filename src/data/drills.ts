import type { Drill } from '../types'
import { player } from './seed'

export const drills: Drill[] = [
  {
    id: 'drill-pick-run',
    playerId: player.id,
    name: 'Shuttle Pick & Run',
    category: 'Movement & agility',
    description:
      'Sprint to a scattered pile of shuttles, pick one up, and return it to a target basket — builds first-step speed and court awareness.',
    ratings: [
      { date: '2026-03-01', score: 2.5, notes: 'Good energy but movement is a bit flat-footed on the turn.' },
      { date: '2026-05-03', score: 3.0, notes: 'Faster first step — starting to plant and change direction more cleanly.' },
      { date: '2026-07-12', score: 3.5, notes: 'Quick and controlled — consistently beats the target time now.' },
    ],
  },
  {
    id: 'drill-6point',
    playerId: player.id,
    name: '6-Point Footwork',
    category: 'Footwork',
    description:
      'Touch six marked points around the court — both net corners, both mid-court sides, both rear corners — in sequence as fast as possible, then recover to center.',
    ratings: [
      { date: '2026-03-01', score: 2.0, notes: 'Pattern is still being memorized — pauses to think between points.' },
      { date: '2026-05-03', score: 3.0, notes: 'Pattern is automatic now. Recovery to center is the next focus.' },
      { date: '2026-07-12', score: 4.0, notes: 'Fast and clean — matches the 6-corner footwork score from the monthly assessment.' },
    ],
  },
  {
    id: 'drill-drop-practice',
    playerId: player.id,
    name: 'Drop Shot Practice',
    category: 'Shot technique',
    description:
      'Repeated fed drops from the rear court, focused on a soft, disguised wrist action rather than power.',
    ratings: [
      { date: '2026-04-05', score: 2.5, notes: 'Drops are landing but the racket face gives the shot away early.' },
      { date: '2026-06-07', score: 3.0, notes: 'Disguise is improving — harder to read out of the same swing as a clear.' },
    ],
  },
  {
    id: 'drill-drop-net',
    playerId: player.id,
    name: 'Drop & Net Combo',
    category: 'Shot technique',
    description:
      'Hit a drop shot from the rear court, then sprint up to finish the point at the net — links a shot to the footwork that follows it.',
    ratings: [
      { date: '2026-05-03', score: 2.5, notes: 'Drop is fine but arrives late to the net for the follow-up.' },
      { date: '2026-07-12', score: 3.0, notes: 'Getting to the net in time more often. Net touch still developing.' },
    ],
  },
  {
    id: 'drill-multi-shuttle',
    playerId: player.id,
    name: 'Multi-Shuttle Feed',
    category: 'Conditioning & repetition',
    description:
      'Coach feeds shuttles back-to-back with minimal pause, so the player hits high volumes of the same shot in a short burst.',
    ratings: [
      { date: '2026-04-05', score: 2.5, notes: 'Fades after about 10 reps — good starting benchmark.' },
      { date: '2026-06-07', score: 3.5, notes: 'Sustaining intensity through a full 20-shuttle feed now.' },
    ],
  },
  {
    id: 'drill-reaction-multi',
    playerId: player.id,
    name: 'Reaction Multi-Shuttle',
    category: 'Reaction & speed',
    description:
      'Same rapid-fire feed, but shuttles are fed to random, unannounced spots — trains reaction time on top of conditioning.',
    ratings: [
      { date: '2026-06-07', score: 2.5, notes: 'First time running this drill — reads the feed a beat late.' },
      { date: '2026-07-12', score: 3.0, notes: 'Reacting quicker. Still occasionally caught flat-footed on the wide feeds.' },
    ],
  },
  {
    id: 'drill-shadow-footwork',
    playerId: player.id,
    name: 'Shadow Footwork',
    category: 'Footwork',
    description:
      'Full footwork patterns performed without a shuttle, isolating technique and movement efficiency from shot execution.',
    ratings: [
      { date: '2026-03-01', score: 2.5, notes: 'Steps are correct but a little heavy — working on staying light on the feet.' },
      { date: '2026-07-12', score: 3.5, notes: 'Much lighter and quicker through the pattern. Good technical base now.' },
    ],
  },
]
