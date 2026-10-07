import smashImg from '../assets/strokes/smash.jpg'
import clearImg from '../assets/strokes/clear.jpg'
import driveImg from '../assets/strokes/drive.jpg'
import netDropImg from '../assets/strokes/net-drop.jpg'

export interface GeneralSkill {
  id: 'stamina' | 'footwork' | 'accuracy' | 'shuttleControl' | 'speed' | 'power'
  name: string
  /** Mock metric keys that feed this skill, first match wins. */
  metricKeys: string[]
}

export const GENERAL_SKILLS: GeneralSkill[] = [
  { id: 'stamina', name: 'Stamina', metricKeys: ['staminaEndurance'] },
  { id: 'footwork', name: 'Footwork', metricKeys: ['sixCornerFootwork', 'directionalMovement'] },
  { id: 'accuracy', name: 'Accuracy', metricKeys: ['serveAccuracy', 'serveConsistency', 'cornerAccuracy'] },
  { id: 'shuttleControl', name: 'Shuttle control', metricKeys: ['racketShuttleControl', 'liveRallyLength'] },
  { id: 'speed', name: 'Speed', metricKeys: ['speed'] },
  { id: 'power', name: 'Power', metricKeys: ['power'] },
]

export interface Stroke {
  id: string
  name: string
  what: string
  skill: GeneralSkill['id']
  image?: string
}

export const STROKES: Stroke[] = [
  { id: 'smash', name: 'Smash', what: 'A hard, steep shot down to win the point.', skill: 'power', image: smashImg },
  { id: 'clear', name: 'Clear', what: 'A high shot to the back of the court.', skill: 'accuracy', image: clearImg },
  { id: 'drive', name: 'Drive', what: 'A fast, flat shot across the court.', skill: 'stamina', image: driveImg },
  { id: 'net-drop', name: 'Net drop', what: 'A soft shot that falls just over the net.', skill: 'footwork', image: netDropImg },
  { id: 'serve', name: 'Serve', what: 'How every rally starts.', skill: 'accuracy' },
  { id: 'backhand', name: 'Backhand', what: 'Shots hit on the non-racket side.', skill: 'footwork' },
]
