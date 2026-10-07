import type { BandDefinition } from '../types'

export function computeOverallRating(
  metricScores: Record<string, number>,
  bandDef: BandDefinition,
): number {
  const sum = bandDef.metrics.reduce(
    (acc, m) => acc + (metricScores[m.key] ?? 0) * m.weight,
    0,
  )
  return Math.round(sum * 10) / 10
}
