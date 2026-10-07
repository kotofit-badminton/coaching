import type { Clip } from '../types'

/** Seed clips for the sample player. Other players start with none. */
export const seedClips: Clip[] = [
  {
    id: 'clip-1',
    playerId: 'p-vikram',
    author: 'coach',
    authorName: 'Coach Priya',
    title: 'Fixing the drop-shot disguise',
    date: '2026-06-07',
    kind: 'video',
    note: "The racket face opens up early — that's the tell. Keep the same swing shape as the clear for one extra beat, then soften the wrist at the last moment.",
  },
  {
    id: 'clip-2',
    playerId: 'p-vikram',
    author: 'coach',
    authorName: 'Coach Priya',
    title: 'Recovery step after a wide return',
    date: '2026-06-07',
    kind: 'video',
    note: 'Good stretch to get there, but the step back to centre is slow. Push off the outside foot straight away instead of resetting first.',
  },
  {
    id: 'clip-3',
    playerId: 'p-vikram',
    author: 'player',
    authorName: 'Vikram',
    title: 'My first 16-shot rally!',
    date: '2026-07-12',
    kind: 'video',
    note: 'Longest rally I have ever done. I kept it going and did not panic.',
  },
]
