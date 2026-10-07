import rallyImg from '../assets/skills/rally.jpg'
import movementImg from '../assets/skills/movement.jpg'
import energyImg from '../assets/skills/energy.jpg'
import matchImg from '../assets/skills/match.jpg'
import courtImg from '../assets/court-shuttles.jpg'
import clearImg from '../assets/strokes/clear.jpg'
import driveImg from '../assets/strokes/drive.jpg'
import smashImg from '../assets/strokes/smash.jpg'

// Plain-language names and one-line meanings for each skill, keyed by metric key.
// `image` is used where we have a photo; otherwise the card falls back to `icon`.
export interface PlainSkill {
  name: string
  meaning: string
  icon: 'corner' | 'serve' | 'rally' | 'choice' | 'footwork' | 'energy' | 'match' | 'speed' | 'power' | 'control' | 'movement' | 'reaction' | 'focus'
  image?: string
}

export const PLAIN_SKILLS: Record<string, PlainSkill> = {
  cornerAccuracy: { name: 'Hitting to the corners', meaning: 'Sending the shuttle to the far corners of the court.', icon: 'corner', image: courtImg },
  serveAccuracy: { name: 'Serving to the right spot', meaning: 'Landing serves in the target box.', icon: 'serve', image: clearImg },
  serveConsistency: { name: 'Serving over the net', meaning: 'Getting serves in, every time.', icon: 'serve', image: clearImg },
  liveRallyLength: { name: 'Keeping rallies going', meaning: 'Returning shots back and forth for longer.', icon: 'rally', image: rallyImg },
  shotSelection: { name: 'Choosing the right shot', meaning: 'Picking the shot that suits where the opponent is.', icon: 'choice', image: driveImg },
  sixCornerFootwork: { name: 'Moving quickly around the court', meaning: 'Stepping fast to every corner and back.', icon: 'footwork', image: movementImg },
  staminaEndurance: { name: 'Keeping energy for a whole session', meaning: 'Staying sharp and active until the end.', icon: 'energy', image: energyImg },
  matchPerformance: { name: 'Playing well in matches', meaning: 'Doing as well in games as in practice.', icon: 'match', image: matchImg },
  racketShuttleControl: { name: 'Keeping the shuttle under control', meaning: 'Hitting the shuttle steadily without losing it.', icon: 'control', image: courtImg },
  fedRallyConsistency: { name: 'Keeping a rally going', meaning: 'Returning the shuttle again and again.', icon: 'rally', image: rallyImg },
  directionalMovement: { name: 'Moving to the shuttle', meaning: 'Getting to the shuttle from any direction.', icon: 'movement', image: movementImg },
  reactionCoordination: { name: 'Reacting quickly', meaning: 'Quick hands and eyes working together.', icon: 'reaction', image: smashImg },
  focusCoachability: { name: 'Listening and improving', meaning: 'Paying attention and using feedback straight away.', icon: 'focus', image: smashImg },
  speed: { name: 'Getting to the shuttle quickly', meaning: 'How fast they move to reach the shuttle.', icon: 'speed', image: driveImg },
  power: { name: 'Hitting with more pace', meaning: 'How hard and fast their shots travel.', icon: 'power', image: smashImg },
}
