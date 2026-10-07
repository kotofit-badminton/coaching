import type { Band, Objective } from '../types'

/**
 * Self-serve registration questionnaire. The player answers multiple-choice
 * questions; the answers both (a) score the three objectives to suggest a track
 * and (b) estimate baseline skill scores so the generated journey's projection
 * is realistic. The player makes the final call on which journey to start.
 */

type SkillAxis = 'serve' | 'placement' | 'rally' | 'movement' | 'match'

export interface QuizOption {
  id: string
  label: string
  hint?: string
  objectivePoints?: Partial<Record<Objective, number>>
  axis?: Partial<Record<SkillAxis, number>>
}

export interface QuizQuestion {
  id: string
  prompt: string
  help?: string
  options: QuizOption[]
}

export const AGE_BANDS: { id: string; label: string; age: number }[] = [
  { id: '5-6', label: '5–6', age: 6 },
  { id: '7-8', label: '7–8', age: 8 },
  { id: '9-10', label: '9–10', age: 10 },
  { id: '11-13', label: '11–13', age: 12 },
]

export function ageFromBandAnswer(id: string): number {
  return AGE_BANDS.find((b) => b.id === id)?.age ?? 10
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'age',
    prompt: 'How old is the player?',
    options: AGE_BANDS.map((b) => ({ id: b.id, label: b.label })),
  },
  {
    id: 'experience',
    prompt: 'How much badminton have they played?',
    options: [
      {
        id: 'beginner',
        label: "Complete beginner — they've never really played",
        objectivePoints: { fun: 1, fitness: 1 },
      },
      {
        id: 'casual',
        label: "They've played a bit — casually, at school, or in the park",
        objectivePoints: { fun: 1 },
      },
      {
        id: 'regular',
        label: 'They play regularly and know the basic shots',
        objectivePoints: { competitive: 1, fitness: 1 },
      },
      {
        id: 'advanced',
        label: "They've played competitively — matches, leagues or tournaments",
        objectivePoints: { competitive: 3, fitness: 1 },
        axis: { match: 3 },
      },
    ],
  },

  // ---- Beginner branch: what do they want out of it ----
  {
    id: 'freq',
    prompt: 'How often would they like to train each week?',
    options: [
      { id: 'once', label: 'Once a week', objectivePoints: { fun: 2 } },
      { id: 'twice', label: 'Twice a week', objectivePoints: { fitness: 1, fun: 1 } },
      { id: 'thrice', label: 'Three or more times a week', objectivePoints: { competitive: 2, fitness: 1 } },
    ],
  },
  {
    id: 'wantOutcome',
    prompt: 'What do they most want to get out of coaching?',
    options: [
      { id: 'fun', label: 'Have fun and make friends', objectivePoints: { fun: 3 } },
      { id: 'fit', label: 'Get fitter and more athletic', objectivePoints: { fitness: 3 } },
      { id: 'compete', label: 'Learn properly and compete one day', objectivePoints: { competitive: 3 } },
      { id: 'unsure', label: 'Not sure yet — just want to try it' },
    ],
  },
  {
    id: 'competitionFeel',
    prompt: 'How do they feel about competition and scoring?',
    options: [
      { id: 'nocomp', label: "They'd rather just play for fun", objectivePoints: { fun: 2 } },
      { id: 'lightcomp', label: 'A bit of friendly scoring is fine', objectivePoints: { fitness: 1 } },
      { id: 'wantscomp', label: 'They want to compete and win', objectivePoints: { competitive: 2 } },
    ],
  },

  // ---- Experienced branch: where are their skills ----
  {
    id: 'howLong',
    prompt: 'How long have they been playing?',
    options: [
      { id: 'lt6', label: 'Under 6 months', objectivePoints: { fun: 1 } },
      { id: '6to12', label: '6–12 months', objectivePoints: { fitness: 1 } },
      { id: '1to2', label: '1–2 years', objectivePoints: { competitive: 1 } },
      { id: 'gt2', label: '2+ years', objectivePoints: { competitive: 2 } },
    ],
  },
  {
    id: 'serve',
    prompt: 'Can they serve so it lands where they want?',
    options: [
      { id: 's1', label: 'Not yet — serves are hit or miss', axis: { serve: 1.5 } },
      { id: 's2', label: 'Sometimes — it goes in about half the time', axis: { serve: 2.5 } },
      { id: 's3', label: 'Usually — lands in the right half reliably', axis: { serve: 3.5 } },
      {
        id: 's4',
        label: 'Almost always — hits a target zone, even under pressure',
        axis: { serve: 4.5 },
        objectivePoints: { competitive: 1 },
      },
    ],
  },
  {
    id: 'placement',
    prompt: 'Can they hit the shuttle where they want — corners and target areas?',
    options: [
      { id: 'p1', label: 'Not really — just tries to get it back', axis: { placement: 1.5 } },
      { id: 'p2', label: 'To one or two spots', axis: { placement: 2.5 } },
      { id: 'p3', label: 'To most areas of the court', axis: { placement: 3.5 } },
      {
        id: 'p4',
        label: 'Accurately, and can disguise where it is going',
        axis: { placement: 4.5 },
        objectivePoints: { competitive: 1 },
      },
    ],
  },
  {
    id: 'rallyLength',
    prompt: 'How long a rally can they keep going?',
    options: [
      { id: 'r1', label: '1–3 shots', axis: { rally: 1.5 } },
      { id: 'r2', label: '4–8 shots', axis: { rally: 2.5 } },
      { id: 'r3', label: '9–15 shots', axis: { rally: 3.5 } },
      {
        id: 'r4',
        label: '15+ shots, with a plan',
        axis: { rally: 4.5 },
        objectivePoints: { competitive: 1 },
      },
    ],
  },
  {
    id: 'movement',
    prompt: 'How is their movement and stamina on court?',
    options: [
      { id: 'm1', label: 'Tires quickly, stands still a lot', axis: { movement: 1.5 } },
      { id: 'm2', label: 'OK for a while, then fades', axis: { movement: 2.5 } },
      {
        id: 'm3',
        label: 'Covers the court and lasts most of a session',
        axis: { movement: 3.5 },
        objectivePoints: { fitness: 1 },
      },
      {
        id: 'm4',
        label: 'Fast, and lasts the whole session',
        axis: { movement: 4.5 },
        objectivePoints: { fitness: 1 },
      },
    ],
  },
  {
    id: 'matches',
    prompt: 'Have they played matches or tournaments?',
    options: [
      { id: 'none', label: 'Never', objectivePoints: { fun: 1 } },
      { id: 'friendly', label: 'Friendly games only', objectivePoints: { fitness: 1 } },
      {
        id: 'club',
        label: 'Club or league nights',
        objectivePoints: { competitive: 2 },
        axis: { match: 3 },
      },
      {
        id: 'sanctioned',
        label: 'Sanctioned tournaments',
        objectivePoints: { competitive: 3 },
        axis: { match: 4 },
      },
    ],
  },

  // ---- Both branches ----
  {
    id: 'success',
    prompt: 'A year from now, what would make this coaching a success?',
    options: [
      { id: 'loved', label: 'They loved every session and still want to play', objectivePoints: { fun: 3 } },
      { id: 'fitter', label: "They're noticeably fitter and quicker", objectivePoints: { fitness: 3 } },
      { id: 'matches', label: 'They can hold their own in real matches', objectivePoints: { competitive: 2 } },
      { id: 'tournament', label: "They've played their first tournament", objectivePoints: { competitive: 3 } },
    ],
  },
]

const QUESTION_BY_ID: Record<string, QuizQuestion> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
)

/** Ordered question ids visible given the answers so far (branching). */
export function visibleQuestionIds(answers: Record<string, string>): string[] {
  const base = ['age', 'experience']
  if (!answers.experience) return base
  if (answers.experience === 'beginner') {
    return [...base, 'freq', 'wantOutcome', 'competitionFeel', 'success']
  }
  return [...base, 'howLong', 'serve', 'placement', 'rallyLength', 'movement', 'matches', 'success']
}

export function visibleQuestions(answers: Record<string, string>): QuizQuestion[] {
  return visibleQuestionIds(answers).map((id) => QUESTION_BY_ID[id])
}

export function questionById(id: string): QuizQuestion | undefined {
  return QUESTION_BY_ID[id]
}

export function answerLabel(questionId: string, optionId: string): string {
  const q = QUESTION_BY_ID[questionId]
  return q?.options.find((o) => o.id === optionId)?.label ?? optionId
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const round1 = (n: number) => Math.round(n * 10) / 10

export interface QuizResult {
  objectiveScores: Record<Objective, number>
  recommendedObjective: Objective
  baselineScores: Record<string, number>
}

export function evaluateQuiz(answers: Record<string, string>, band: Band): QuizResult {
  const objectiveScores: Record<Objective, number> = { fun: 0, fitness: 0, competitive: 0 }
  const axes: Partial<Record<SkillAxis, number>> = {}

  for (const q of QUESTIONS) {
    const optId = answers[q.id]
    if (!optId) continue
    const opt = q.options.find((o) => o.id === optId)
    if (!opt) continue
    for (const [k, v] of Object.entries(opt.objectivePoints ?? {})) {
      objectiveScores[k as Objective] += v as number
    }
    for (const [k, v] of Object.entries(opt.axis ?? {})) {
      const axis = k as SkillAxis
      axes[axis] = Math.max(axes[axis] ?? 0, v as number)
    }
  }

  const dflt =
    answers.experience === 'advanced' ? 3 : answers.experience === 'beginner' ? 1.5 : 2.5
  const A = (k: SkillAxis) => clamp(axes[k] ?? dflt, 1, 5)

  const baselineScores: Record<string, number> =
    band === 'A'
      ? {
          racketShuttleControl: A('placement'),
          fedRallyConsistency: A('rally'),
          serveConsistency: A('serve'),
          directionalMovement: A('movement'),
          reactionCoordination: round1((A('movement') + dflt) / 2),
          focusCoachability: 2.5,
        }
      : {
          cornerAccuracy: A('placement'),
          serveAccuracy: A('serve'),
          liveRallyLength: A('rally'),
          shotSelection: round1(clamp(A('placement') - 0.5, 1, 5)),
          sixCornerFootwork: A('movement'),
          staminaEndurance: A('movement'),
          matchPerformance: A('match'),
        }

  const order: Objective[] = ['fun', 'fitness', 'competitive']
  let recommendedObjective: Objective = 'fun'
  for (const obj of order) {
    if (objectiveScores[obj] > objectiveScores[recommendedObjective]) {
      recommendedObjective = obj
    }
  }

  return { objectiveScores, recommendedObjective, baselineScores }
}

export function summariseAnswers(
  answers: Record<string, string>,
  suggested: Objective,
  chosen: Objective,
): string {
  const parts: string[] = ['Self-registered.']
  if (answers.experience) parts.push(answerLabel('experience', answers.experience) + '.')
  const forBranch =
    answers.experience === 'beginner'
      ? ['freq', 'wantOutcome', 'competitionFeel']
      : ['howLong', 'serve', 'placement', 'rallyLength', 'movement', 'matches']
  for (const id of forBranch) {
    if (answers[id]) parts.push(`${questionById(id)?.prompt} — ${answerLabel(id, answers[id])}`)
  }
  if (answers.success) parts.push(`Success looks like: ${answerLabel('success', answers.success)}`)
  parts.push(
    suggested === chosen
      ? `Suggested and chose the ${chosen} track.`
      : `Suggested the ${suggested} track; chose ${chosen}.`,
  )
  return parts.join(' ')
}
