import type {
  Band,
  Journey,
  JourneyCheckpoint,
  JourneyPhaseInfo,
  JourneyProgressEntry,
  Objective,
  WeeklyPlanItem,
} from '../types'
import { addWeeks } from '../utils/format'
import { journeyTemplates } from './journeyTemplates'

interface EvaluationLike {
  playerId: string
  band: Band
  objective: Objective
  baselineScores: Record<string, number>
  date: string // ISO — journey start date
}

/** Neutral fallback when a target metric wasn't scored at onboarding. */
const DEFAULT_BASELINE = 2

/**
 * Build a journey from an onboarding evaluation and the matching authored
 * template. The template supplies the destination (targets) and the shape (its
 * phases: themes, drills, intensity, capability payoffs). The baseline stretches
 * or compresses the projection — a bigger gap to each target means more classes
 * and more weeks — and those weeks are spread across the phases by weight.
 */
export function generateJourney(
  evalRec: EvaluationLike,
  opts: { id?: string; createdDate?: string } = {},
): Journey {
  const template = journeyTemplates[evalRec.objective][evalRec.band]
  const startDate = evalRec.date
  const createdDate = opts.createdDate ?? evalRec.date
  const perWeek = Math.max(1, template.classesPerWeek)

  const skillTargets = template.skillTargets.map((t) => {
    const baseline = evalRec.baselineScores[t.metricKey] ?? DEFAULT_BASELINE
    const gap = Math.max(0, t.target - baseline)
    const classesToTarget = gap === 0 ? 0 : Math.ceil(gap / template.ratePerClass)
    return {
      metricKey: t.metricKey,
      baseline: round1(baseline),
      current: round1(baseline),
      target: t.target,
      classesToTarget,
    }
  })

  const totalClasses = Math.max(
    template.minClasses,
    ...skillTargets.map((t) => t.classesToTarget),
  )
  const estimatedWeeks = Math.max(
    Math.ceil(totalClasses / perWeek),
    template.phases.length, // at least one week per phase
  )
  const targetDate = addWeeks(startDate, estimatedWeeks)

  // --- spread weeks across phases by weight (each phase gets >= 1) ---
  const phaseTpls = template.phases
  const totalWeight = phaseTpls.reduce((a, p) => a + p.weight, 0)
  const alloc = phaseTpls.map((p) =>
    Math.max(1, Math.floor((p.weight / totalWeight) * estimatedWeeks)),
  )
  let drift = estimatedWeeks - alloc.reduce((a, b) => a + b, 0)
  const byWeight = phaseTpls
    .map((p, i) => ({ i, w: p.weight }))
    .sort((a, b) => b.w - a.w)
  let k = 0
  while (drift > 0) {
    alloc[byWeight[k % byWeight.length].i]++
    drift--
    k++
  }
  while (drift < 0) {
    const idx = alloc
      .map((v, i) => ({ v, i }))
      .filter((x) => x.v > 1)
      .sort((a, b) => b.v - a.v)[0]?.i
    if (idx == null) break
    alloc[idx]--
    drift++
  }

  // --- phase infos with week/class spans ---
  const phases: JourneyPhaseInfo[] = []
  let weekCursor = 1
  phaseTpls.forEach((p, i) => {
    const last = i === phaseTpls.length - 1
    const startWeek = weekCursor
    const endWeek = last ? estimatedWeeks : startWeek + alloc[i] - 1
    weekCursor = endWeek + 1
    phases.push({
      name: p.name,
      intensity: p.intensity,
      startWeek,
      endWeek,
      startClass: (startWeek - 1) * perWeek + 1,
      endClass: last ? totalClasses : Math.min(totalClasses, endWeek * perWeek),
      focusMetricKeys: p.focusMetricKeys,
      milestoneLabel: p.milestoneLabel,
      capability: p.capability,
    })
  })

  // --- week-by-week plan ---
  const weeklyPlan: WeeklyPlanItem[] = Array.from({ length: estimatedWeeks }, (_, idx) => {
    const week = idx + 1
    let pi = phases.findIndex((ph) => week >= ph.startWeek && week <= ph.endWeek)
    if (pi < 0) pi = phases.length - 1
    const phase = phases[pi]
    const tpl = phaseTpls[pi]
    const inPhase = week - phase.startWeek
    return {
      week,
      phase: phase.name,
      intensity: phase.intensity,
      focusMetricKeys: tpl.focusMetricKeys,
      drillIds: tpl.drillIds,
      summary: tpl.weekSummaries[inPhase % tpl.weekSummaries.length],
    }
  })

  // --- checkpoints: one achievement at the end of each phase ---
  const checkpoints: JourneyCheckpoint[] = phases.map((ph) => ({
    atClass: ph.endClass,
    atWeek: ph.endWeek,
    label: ph.milestoneLabel,
    capability: ph.capability,
    phaseName: ph.name,
    done: false,
  }))

  // --- drill path: unique union of phase drills, in order ---
  const drillPath: string[] = []
  for (const p of phaseTpls) {
    for (const d of p.drillIds) if (!drillPath.includes(d)) drillPath.push(d)
  }

  const journey: Journey = {
    id: opts.id ?? `jr-${evalRec.playerId}-${evalRec.objective}`,
    playerId: evalRec.playerId,
    objective: evalRec.objective,
    band: evalRec.band,
    createdDate,
    targetSummary: template.targetSummary,
    skillTargets,
    projection: {
      totalClasses,
      classesPerWeek: perWeek,
      estimatedWeeks,
      startDate,
      targetDate,
    },
    drillPath,
    weeklyPlan,
    phases,
    checkpoints,
    progressLog: [],
    classesCompleted: 0,
  }
  return journey
}

/**
 * Fold the progress log back into the journey's live state: current skill
 * scores, ticked checkpoints and the cumulative class count. Pure — returns a
 * new journey, safe to call after every logged entry.
 */
export function recomputeJourneyProgress(journey: Journey): Journey {
  const log = [...journey.progressLog].sort((a, b) => (a.date < b.date ? -1 : 1))
  const latest = log[log.length - 1]
  const classesCompleted = latest ? latest.classesCompleted : 0

  const skillTargets = journey.skillTargets.map((t) => {
    let current = t.baseline
    for (const entry of log) {
      if (entry.scores[t.metricKey] != null) current = entry.scores[t.metricKey]
    }
    return { ...t, current: round1(current) }
  })

  const checkpoints = journey.checkpoints.map((c) => ({
    ...c,
    done: classesCompleted >= c.atClass,
  }))

  return { ...journey, progressLog: log, skillTargets, checkpoints, classesCompleted }
}

/** Append a progress entry and return the recomputed journey. */
export function addProgressEntry(
  journey: Journey,
  entry: JourneyProgressEntry,
): Journey {
  return recomputeJourneyProgress({
    ...journey,
    progressLog: [...journey.progressLog, entry],
  })
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
