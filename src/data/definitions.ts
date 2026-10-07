import type { Band, MetricDefinition } from '../types'
import { bandDefinitions } from './bandDefinitions'

/** Kids age → band. 5–8 = Band A, 9–13 = Band B. */
export function bandForAge(age: number): Band {
  return age <= 8 ? 'A' : 'B'
}

/** Friendly age label — never show "Band A/B" to players. */
export function ageGroupLabel(band: Band): string {
  return band === 'A' ? 'Ages 5–8' : 'Ages 9–13'
}

/** Plain-word name for a 1–5 level. */
const LEVEL_WORDS = [
  '',
  'Just starting',
  'Finding your feet',
  'Getting confident',
  'Playing well',
  'Really strong',
]

export function levelWord(value: number): string {
  return LEVEL_WORDS[Math.min(5, Math.max(1, Math.round(value)))]
}

/** Kids-only for now; a single seam for adult metric sets to slot in later. */
export function getBandDefinition(band: Band) {
  return bandDefinitions[band]
}

export function metricDef(band: Band, key: string): MetricDefinition | undefined {
  return bandDefinitions[band].metrics.find((m) => m.key === key)
}

export function metricLabel(band: Band, key: string): string {
  return metricDef(band, key)?.label ?? key
}
