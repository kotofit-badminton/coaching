import type { DrillTemplate } from '../types'

/**
 * Shared drill catalogue that journey paths and weekly plans reference by id.
 * Distinct from src/data/drills.ts, which holds one player's *rated* drill history.
 */
export const drillLibrary: DrillTemplate[] = [
  // --- Fun-leaning, game-based ---
  {
    id: 'dt-warmup-games',
    name: 'Warm-up Games',
    category: 'Warm-up & fun',
    description:
      'Tag, shuttle-catch relays and reaction games to raise the heart rate and get everyone smiling before the skill work starts.',
  },
  {
    id: 'dt-keepy-uppy',
    name: 'Keepy-Uppy Challenge',
    category: 'Racket control',
    description:
      'Keep the shuttle up off the racket for as many taps as possible — solo, then with a partner. Builds soft hands and a feel for the shuttle.',
  },
  {
    id: 'dt-coop-rally',
    name: 'Cooperative Rally Game',
    category: 'Rally play',
    description:
      'Partners rally to keep the shuttle alive as long as they can — no winners, just a shared count to beat. Teaches control, placement and patience.',
  },
  {
    id: 'dt-target-game',
    name: 'Target & Hoop Game',
    category: 'Accuracy game',
    description:
      'Hoops and cones become point targets. Hit the target, score a point. Makes accuracy practice feel like a carnival game.',
  },
  {
    id: 'dt-king-court',
    name: 'King of the Court',
    category: 'Games play',
    description:
      'Rotating short games — win the point, stay on; lose it, rotate out. High-energy, lots of laughs, everyone plays a lot of shuttles.',
  },
  {
    id: 'dt-mini-match',
    name: 'Mini-Match',
    category: 'Match play',
    description:
      'Short games to 11 on a half or full court, light scoring, coach umpires and keeps it fun. A first taste of real play.',
  },
  // --- Fitness-leaning, conditioning ---
  {
    id: 'dt-dynamic-warmup',
    name: 'Dynamic Warm-up',
    category: 'Warm-up & mobility',
    description:
      'Skips, lunges, leg swings, arm circles and short strides — a structured 8-minute routine to prime the body for footwork and agility work.',
  },
  {
    id: 'dt-agility-ladder',
    name: 'Agility Ladder',
    category: 'Speed & agility',
    description:
      'Fast-feet patterns through a floor ladder — in-in-out, lateral, icky shuffle — for foot speed, rhythm and coordination.',
  },
  {
    id: 'dt-cone-shuttle',
    name: 'Cone Shuttle Run',
    category: 'Speed & agility',
    description:
      'Timed sprints between cones with direction changes — the classic 5-10-5 and court-length shuttles — to build acceleration and braking.',
  },
  {
    id: 'dt-pick-run',
    name: 'Shuttle Pick & Run',
    category: 'Movement & agility',
    description:
      'Sprint to a scattered pile of shuttles, pick one up, return it to a target basket — first-step speed plus court awareness.',
  },
  {
    id: 'dt-6point',
    name: '6-Point Footwork',
    category: 'Footwork',
    description:
      'Touch six marked points around the court in sequence as fast as possible, recovering to centre between each. Trains the full movement pattern.',
  },
  {
    id: 'dt-shadow-footwork',
    name: 'Shadow Footwork',
    category: 'Footwork',
    description:
      'Full footwork patterns with no shuttle, isolating movement technique and efficiency from shot execution.',
  },
  {
    id: 'dt-multi-shuttle',
    name: 'Multi-Shuttle Feed',
    category: 'Conditioning & repetition',
    description:
      'Coach feeds shuttles back-to-back with minimal pause so the player hits a high volume of the same shot in a short, demanding burst.',
  },
  {
    id: 'dt-reaction-multi',
    name: 'Reaction Multi-Shuttle',
    category: 'Reaction & speed',
    description:
      'Rapid-fire feed to random, unannounced spots — reaction time on top of conditioning.',
  },
  {
    id: 'dt-mobility-cooldown',
    name: 'Mobility Cooldown',
    category: 'Warm-up & mobility',
    description:
      'Guided static stretching and hip/shoulder mobility to finish the session, plus a quick check-in on how the body feels.',
  },
  // --- Competitive-leaning, technical & tactical ---
  {
    id: 'dt-4corner',
    name: '4-Corner Accuracy',
    category: 'Shot technique',
    description:
      'Drive the shuttle to each of the four court corners on call, with a taped target zone — accuracy and disguise before power.',
  },
  {
    id: 'dt-drop-practice',
    name: 'Drop Shot Practice',
    category: 'Shot technique',
    description:
      'Repeated fed drops from the rear court, focused on a soft, disguised wrist action rather than pace.',
  },
  {
    id: 'dt-drop-net',
    name: 'Drop & Net Combo',
    category: 'Shot technique',
    description:
      'Hit a drop from the rear court, then sprint in to finish at the net — links the shot to the footwork that has to follow it.',
  },
  {
    id: 'dt-pattern-play',
    name: 'Tactical Pattern Play',
    category: 'Tactics',
    description:
      'Pre-set shot sequences (e.g. clear–drop–net–lift) run at rally pace so patterns become automatic under pressure.',
  },
  {
    id: 'dt-situational-points',
    name: 'Situational Points',
    category: 'Tactics',
    description:
      'Play points from a set scenario — serving at 19-19, defending a smash, forcing the net — to rehearse decisions that decide matches.',
  },
  {
    id: 'dt-match-sim',
    name: 'Match Simulation',
    category: 'Match play',
    description:
      'Full games at match intensity with proper scoring, a coach umpire and a between-games debrief.',
  },
  {
    id: 'dt-tournament-prep',
    name: 'Tournament Prep',
    category: 'Match play',
    description:
      'Warm-up routine, between-point rituals, nerves management and a game plan for a named upcoming event.',
  },
]

export const drillTemplateById: Record<string, DrillTemplate> = Object.fromEntries(
  drillLibrary.map((d) => [d.id, d]),
)
