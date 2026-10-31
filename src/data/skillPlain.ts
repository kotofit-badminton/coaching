import rallyImg from '../assets/skills/rally.jpg'
import matchImg from '../assets/skills/match.jpg'
import staminaImg from '../assets/skills/stamina.jpg'
import speedImg from '../assets/skills/speed.jpg'
import footworkImg from '../assets/skills/footwork.jpg'
import movingImg from '../assets/skills/moving.jpg'
import reactionImg from '../assets/skills/reaction.jpg'
import focusImg from '../assets/skills/focus.jpg'
import controlImg from '../assets/skills/control.jpg'
import cornerImg from '../assets/skills/corner.jpg'
import driveImg from '../assets/strokes/drive.jpg'
import smashImg from '../assets/strokes/smash.jpg'
import serveImg from '../assets/strokes/serve.jpg'

// Plain-language names and one-line meanings for each skill, keyed by metric key.
// `image` is used where we have a photo; otherwise the card falls back to `icon`.
export interface PlainSkill {
  name: string
  meaning: string
  icon: 'corner' | 'serve' | 'rally' | 'choice' | 'footwork' | 'energy' | 'match' | 'speed' | 'power' | 'control' | 'movement' | 'reaction' | 'focus'
  image?: string
}

export const PLAIN_SKILLS: Record<string, PlainSkill> = {
  cornerAccuracy: { name: 'Hitting to the corners', meaning: 'Sending the shuttle to the far corners of the court.', icon: 'corner', image: cornerImg },
  serveAccuracy: { name: 'Serving to the right spot', meaning: 'Landing serves in the target box.', icon: 'serve', image: serveImg },
  serveConsistency: { name: 'Serving over the net', meaning: 'Getting serves in, every time.', icon: 'serve', image: serveImg },
  liveRallyLength: { name: 'Keeping rallies going', meaning: 'Returning shots back and forth for longer.', icon: 'rally', image: rallyImg },
  shotSelection: { name: 'Choosing the right shot', meaning: 'Picking the shot that suits where the opponent is.', icon: 'choice', image: driveImg },
  sixCornerFootwork: { name: 'Moving quickly around the court', meaning: 'Stepping fast to every corner and back.', icon: 'footwork', image: footworkImg },
  staminaEndurance: { name: 'Keeping energy for a whole session', meaning: 'Staying sharp and active until the end.', icon: 'energy', image: staminaImg },
  matchPerformance: { name: 'Playing well in matches', meaning: 'Doing as well in games as in practice.', icon: 'match', image: matchImg },
  racketShuttleControl: { name: 'Keeping the shuttle under control', meaning: 'Hitting the shuttle steadily without losing it.', icon: 'control', image: controlImg },
  fedRallyConsistency: { name: 'Keeping a rally going', meaning: 'Returning the shuttle again and again.', icon: 'rally', image: rallyImg },
  directionalMovement: { name: 'Moving to the shuttle', meaning: 'Getting to the shuttle from any direction.', icon: 'movement', image: movingImg },
  reactionCoordination: { name: 'Reacting quickly', meaning: 'Quick hands and eyes working together.', icon: 'reaction', image: reactionImg },
  focusCoachability: { name: 'Listening and improving', meaning: 'Paying attention and using feedback straight away.', icon: 'focus', image: focusImg },
  speed: { name: 'Getting to the shuttle quickly', meaning: 'How fast they move to reach the shuttle.', icon: 'speed', image: speedImg },
  power: { name: 'Hitting with more pace', meaning: 'How hard and fast their shots travel.', icon: 'power', image: smashImg },
}
