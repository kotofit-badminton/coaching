import smashImg from '../assets/strokes/smash.jpg'
import clearImg from '../assets/strokes/clear.jpg'
import driveImg from '../assets/strokes/drive.jpg'
import netDropImg from '../assets/strokes/net-drop.jpg'
import netPlayImg from '../assets/strokes/net-play.jpg'
import serveImg from '../assets/strokes/serve.jpg'
import backhandImg from '../assets/strokes/backhand.jpg'
import flexibilityImg from '../assets/skills/flexibility.jpg'

// Groups follow the BWF coaching framework (movement, hitting, tactics, physical,
// psychological), renamed in plain words for parents.
export type SkillGroup = 'shots' | 'movement' | 'fitness' | 'game' | 'mindset'

export const GROUP_LABELS: Record<SkillGroup, string> = {
  shots: 'Shots',
  movement: 'Movement',
  fitness: 'Fitness',
  game: 'Game sense',
  mindset: 'Mindset',
}

export interface GeneralSkill {
  id: string
  name: string
  group: SkillGroup
  /** Mock metric keys that feed this skill, first match wins. Empty = not measured yet. */
  metricKeys: string[]
  image?: string
}

export const GENERAL_SKILLS: GeneralSkill[] = [
  // Shots
  { id: 'accuracy', name: 'Accuracy', group: 'shots', metricKeys: ['serveAccuracy', 'serveConsistency', 'cornerAccuracy'] },
  { id: 'shuttleControl', name: 'Shuttle control', group: 'shots', metricKeys: ['racketShuttleControl', 'liveRallyLength'] },
  // Movement
  { id: 'footwork', name: 'Footwork', group: 'movement', metricKeys: ['sixCornerFootwork', 'directionalMovement'] },
  { id: 'recovery', name: 'Recovery to the centre', group: 'movement', metricKeys: [] },
  // Fitness
  { id: 'stamina', name: 'Stamina', group: 'fitness', metricKeys: ['staminaEndurance'] },
  { id: 'speed', name: 'Speed', group: 'fitness', metricKeys: ['speed'] },
  { id: 'power', name: 'Power', group: 'fitness', metricKeys: ['power'] },
  { id: 'agility', name: 'Agility', group: 'fitness', metricKeys: [] },
  { id: 'flexibility', name: 'Flexibility', group: 'fitness', metricKeys: [], image: flexibilityImg },
  // Game sense
  { id: 'shotChoice', name: 'Choosing the right shot', group: 'game', metricKeys: ['shotSelection'] },
  { id: 'matchPlay', name: 'Playing well in matches', group: 'game', metricKeys: ['matchPerformance'] },
  // Mindset
  { id: 'focus', name: 'Listening and improving', group: 'mindset', metricKeys: ['focusCoachability'] },
  { id: 'reaction', name: 'Reacting quickly', group: 'mindset', metricKeys: ['reactionCoordination'] },
  { id: 'confidence', name: 'Confidence on court', group: 'mindset', metricKeys: [] },
]

export interface Stroke {
  id: string
  name: string
  what: string
  skill: string
  image?: string
}

export const STROKES: Stroke[] = [
  { id: 'smash', name: 'Smash', what: 'A hard, steep shot down to win the point.', skill: 'power', image: smashImg },
  { id: 'clear', name: 'Clear', what: 'A high shot to the back of the court.', skill: 'accuracy', image: clearImg },
  { id: 'drive', name: 'Drive', what: 'A fast, flat shot across the court.', skill: 'stamina', image: driveImg },
  { id: 'net-drop', name: 'Net drop', what: 'A soft shot that falls just over the net.', skill: 'footwork', image: netDropImg },
  { id: 'net-play', name: 'Net play', what: 'Quick, soft exchanges right at the net.', skill: 'shuttleControl', image: netPlayImg },
  { id: 'serve', name: 'Serve', what: 'How every rally starts.', skill: 'accuracy', image: serveImg },
  { id: 'backhand', name: 'Backhand', what: 'Shots hit on the non-racket side.', skill: 'footwork', image: backhandImg },
]
