import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Objective } from '../../types'
import { useStore } from '../../data/store'
import { ageGroupLabel, bandForAge } from '../../data/definitions'
import { generateJourney } from '../../data/generateJourney'
import { objectiveBlurbs, objectiveLabels } from '../../data/journeyTemplates'
import {
  ageFromBandAnswer,
  evaluateQuiz,
  summariseAnswers,
  visibleQuestions,
} from '../../data/onboardingQuiz'
import JourneyView from '../journey/JourneyView'

const TODAY = '2026-08-30'
const OBJECTIVES: Objective[] = ['fun', 'fitness', 'competitive']

export default function RegisterFlow() {
  const { onboardPlayer, signInAsPlayer } = useStore()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0) // 0 = name; 1..N = questions; N+1 = results
  const [chosen, setChosen] = useState<Objective | null>(null)

  const questions = useMemo(() => visibleQuestions(answers), [answers])
  const totalSteps = 1 + questions.length
  const onResults = step >= totalSteps

  useEffect(() => {
    if (step > totalSteps) setStep(totalSteps)
  }, [totalSteps, step])

  const age = answers.age ? ageFromBandAnswer(answers.age) : 10
  const band = bandForAge(age)

  const result = useMemo(
    () => (onResults ? evaluateQuiz(answers, band) : null),
    [onResults, answers, band],
  )
  const suggested = result?.recommendedObjective ?? 'fun'
  const selectedObjective = chosen ?? suggested

  const previewJourney = useMemo(() => {
    if (!result) return null
    return generateJourney(
      {
        playerId: 'preview',
        band,
        objective: selectedObjective,
        baselineScores: result.baselineScores,
        date: TODAY,
      },
      { id: 'jr-preview-register' },
    )
  }, [result, band, selectedObjective])

  function setAnswer(qid: string, oid: string) {
    setAnswers((a) => {
      const next: Record<string, string> = { ...a, [qid]: oid }
      if (qid === 'experience') {
        const keep = new Set<string>(['age', 'experience'])
        visibleQuestions(next).forEach((q) => keep.add(q.id))
        for (const k of Object.keys(next)) if (!keep.has(k)) delete next[k]
      }
      return next
    })
  }

  const currentQuestion =
    step >= 1 && step <= questions.length ? questions[step - 1] : null
  const canAdvance =
    step === 0
      ? name.trim().length > 0
      : currentQuestion
        ? Boolean(answers[currentQuestion.id])
        : true

  function create() {
    if (!result) return
    const id = onboardPlayer({
      name: name.trim(),
      age,
      objective: selectedObjective,
      baselineScores: result.baselineScores,
      notes: summariseAnswers(answers, suggested, selectedObjective),
      quizAnswers: answers,
      date: TODAY,
    })
    signInAsPlayer(id)
    navigate(`/player/${id}`)
  }

  const maxObjScore = result
    ? Math.max(1, ...OBJECTIVES.map((o) => result.objectiveScores[o]))
    : 1

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <div className="quiz-progress-track">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${Math.round((Math.min(step, totalSteps) / totalSteps) * 100)}%`,
            }}
          />
        </div>
        <span className="quiz-progress-label">
          {onResults ? 'Your suggested plan' : `Question ${step + 1} of ${totalSteps + 1}`}
        </span>
      </div>

      {step === 0 && (
        <section className="card quiz-card">
          <h2>Let's find the right plan</h2>
          <p className="section-subtitle">
            A few quick questions about where the player is now and what they'd like to get
            out of it. We'll suggest a plan at the end — you choose.
          </p>
          <label className="form-field">
            <span>Player's first name</span>
            <input
              className="quiz-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rhea"
              autoFocus
            />
          </label>
        </section>
      )}

      {currentQuestion && (
        <section className="card quiz-card">
          <h2 className="quiz-prompt">{currentQuestion.prompt}</h2>
          {currentQuestion.help && <p className="quiz-help">{currentQuestion.help}</p>}
          <div className="quiz-options">
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.id] === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`quiz-option${selected ? ' selected' : ''}`}
                  onClick={() => setAnswer(currentQuestion.id, opt.id)}
                >
                  <span className="quiz-option-radio" aria-hidden="true" />
                  <span className="quiz-option-body">
                    <span className="quiz-option-label">{opt.label}</span>
                    {opt.hint && <span className="quiz-option-hint">{opt.hint}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {onResults && result && previewJourney && (
        <div className="quiz-result">
          <section className="card quiz-card">
            <div className="quiz-reco-banner">
              <span className="quiz-reco-eyebrow">From your answers, we'd suggest</span>
              <span className={`jrny-objective-pill obj-${suggested}`}>
                {objectiveLabels[suggested]}
              </span>
            </div>
            <p className="section-subtitle">
              Pick the plan to start with — the player follows one at a time. A coach can
              switch it later.
            </p>

            <div className="quiz-obj-scores">
              {OBJECTIVES.map((o) => (
                <div className="quiz-obj-score" key={o}>
                  <span className="quiz-obj-score-label">{objectiveLabels[o]}</span>
                  <div className="quiz-obj-score-track">
                    <div
                      className={`quiz-obj-score-fill obj-fill-${o}`}
                      style={{
                        width: `${Math.round((result.objectiveScores[o] / maxObjScore) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-obj-cards">
              {OBJECTIVES.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`quiz-obj-card obj-${o}${
                    selectedObjective === o ? ' selected' : ''
                  }${suggested === o ? ' suggested' : ''}`}
                  onClick={() => setChosen(o)}
                >
                  <span className="quiz-obj-card-title">
                    {objectiveLabels[o]}
                    {suggested === o && <span className="quiz-obj-card-tag"> suggested</span>}
                  </span>
                  <span className="quiz-obj-card-blurb">{objectiveBlurbs[o]}</span>
                </button>
              ))}
            </div>

            <button type="button" className="form-submit quiz-create" onClick={create}>
              Start {name.trim() || 'this player'}'s {objectiveLabels[selectedObjective]} plan
            </button>
          </section>

          <div>
            <div className="admin-preview-banner">
              Preview — {objectiveLabels[selectedObjective]} plan, {ageGroupLabel(band)}
            </div>
            <JourneyView
              journey={previewJourney}
              band={band}
              subjectName={name.trim() || 'They'}
              showProgressLog={false}
            />
          </div>
        </div>
      )}

      <div className="quiz-nav">
        <button
          type="button"
          className="quiz-back"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        {!onResults && (
          <button
            type="button"
            className="quiz-next"
            onClick={() => canAdvance && setStep((s) => Math.min(s + 1, totalSteps))}
            disabled={!canAdvance}
          >
            {step === totalSteps - 1 ? 'See the plan' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}
