import type { Match } from '../types'
import { player } from './seed'

export const matches: Match[] = [
  {
    id: 'match-1',
    playerId: player.id,
    type: 'friendly',
    date: '2026-05-03',
    opponentName: 'Surya Patel',
    result: 'win',
    games: [
      { playerScore: 21, opponentScore: 18 },
      { playerScore: 19, opponentScore: 21 },
      { playerScore: 21, opponentScore: 15 },
    ],
    notes:
      'First friendly match! Nervy in game 2 but settled down and closed it out well in the decider.',
  },
  {
    id: 'match-2',
    playerId: player.id,
    type: 'friendly',
    date: '2026-06-14',
    opponentName: 'Ananya Rao',
    result: 'loss',
    games: [
      { playerScore: 15, opponentScore: 21 },
      { playerScore: 18, opponentScore: 21 },
    ],
    notes:
      'Opponent was a level up in footwork speed. Good learning match — worked on staying patient in rallies afterward.',
  },
  {
    id: 'match-3',
    playerId: player.id,
    type: 'friendly',
    date: '2026-07-05',
    opponentName: 'Surya Patel',
    result: 'win',
    games: [
      { playerScore: 21, opponentScore: 12 },
      { playerScore: 21, opponentScore: 17 },
    ],
    notes: 'Rematch — clear improvement in corner placement compared to May. Confident throughout.',
  },
  {
    id: 'match-4',
    playerId: player.id,
    type: 'tournament',
    date: '2026-07-25',
    opponentName: 'Marcus Chen',
    eventName: 'Jersey City Junior Open — U13 Round 1',
    result: 'win',
    games: [
      { playerScore: 21, opponentScore: 19 },
      { playerScore: 21, opponentScore: 16 },
    ],
    notes: 'First tournament match! Handled the bigger crowd and longer wait between matches well.',
  },
  {
    id: 'match-5',
    playerId: player.id,
    type: 'tournament',
    date: '2026-07-25',
    opponentName: 'Priya Nair',
    eventName: 'Jersey City Junior Open — U13 Quarterfinal',
    result: 'loss',
    games: [
      { playerScore: 16, opponentScore: 21 },
      { playerScore: 19, opponentScore: 21 },
    ],
    notes:
      "Quarterfinal exit but a strong showing for a first tournament. Opponent's serve was tough to read — good film to review together.",
  },
]
