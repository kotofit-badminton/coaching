import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../data/store'
import { ageGroupLabel, bandForAge } from '../../data/definitions'
import { generateJourney } from '../../data/generateJourney'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import {
  ageFromBandAnswer,
  evaluateQuiz,
  summariseAnswers,
  visibleQuestions,
} from '../../data/onboardingQuiz'
import JourneyView from '../journey/JourneyView'

const TODAY = '2026-08-30'
// Only two journeys are offered at sign-up, picked by age, not chosen by the
// family. The 3x/week 'competitive' objective and the old 3-way picker are
// disabled here but the data model and journey templates still support them.
const JOURNEY_LABELS: Record<'fun' | 'fitness', string> = {
  fun: 'Fun / light compete',
  fitness: 'Competitive',
}

function objectiveForAge(age: number): 'fun' | 'fitness' {
  return age <= 7 ? 'fun' : 'fitness'
}

interface Props {
  /** Player-portal sign-up: also creates a Supabase account before the plan. */
  withAccount?: boolean
}

export default function RegisterFlow({ withAccount = false }: Props) {
  const { onboardPlayer, signInAsPlayer } = useStore()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0) // 0 = name; 1..N = questions; N+1 = results

  const [accountEmail, setAccountEmail] = useState('')
  const [accountPassword, setAccountPassword] = useState('')
  const [accountBusy, setAccountBusy] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)
  const [accountNotice, setAccountNotice] = useState<string | null>(null)

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
  const assignedObjective = objectiveForAge(age)

  const previewJourney = useMemo(() => {
    if (!result) return null
    return generateJourney(
      {
        playerId: 'preview',
        band,
        objective: assignedObjective,
        baselineScores: result.baselineScores,
        date: TODAY,
      },
      { id: 'jr-preview-register' },
    )
  }, [result, band, assignedObjective])

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

  function createLocalPlayer() {
    const id = onboardPlayer({
      name: name.trim(),
      age,
      objective: assignedObjective,
      baselineScores: result!.baselineScores,
      notes: summariseAnswers(answers, assignedObjective, assignedObjective),
      quizAnswers: answers,
      date: TODAY,
    })
    signInAsPlayer(id)
    return id
  }

  function create() {
    if (!result) return
    const id = createLocalPlayer()
    navigate(`/player/${id}`)
  }

  async function createWithAccount(e: React.FormEvent) {
    e.preventDefault()
    if (!result || !supabaseConfigured) return
    setAccountBusy(true)
    setAccountError(null)
    setAccountNotice(null)
    const { error: err } = await supabase.auth.signUp({
      email: accountEmail,
      password: accountPassword,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    })
    setAccountBusy(false)
    if (err) {
      setAccountError(err.message)
      return
    }
    createLocalPlayer()
    setAccountNotice(
      `Account created for ${accountEmail}. Check your email to confirm it, then sign in to see ${name.trim() || 'the'}'s plan.`,
    )
  }

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
          {onResults ? 'Your plan' : `Question ${step + 1} of ${totalSteps + 1}`}
        </span>
      </div>

      {step === 0 && (
        <section className="card quiz-card">
          <h2>Let's find the right plan</h2>
          <p className="section-subtitle">A few quick questions about the player.</p>
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
              <span className="quiz-reco-eyebrow">Based on age, {name.trim() || 'this player'}'s plan is</span>
              <span className={`jrny-objective-pill obj-${assignedObjective}`}>
                {JOURNEY_LABELS[assignedObjective]}
              </span>
            </div>
            <p className="section-subtitle">A coach can switch it later if needed.</p>

            {withAccount ? (
              accountNotice ? (
                <p className="admin-saved">{accountNotice}</p>
              ) : (
                <form className="auth-form quiz-account-form" onSubmit={createWithAccount}>
                  <p className="section-subtitle">
                    Create your account to save {name.trim() || 'this player'}'s plan
                    and check in on it any time.
                  </p>
                  <label className="form-field">
                    <span>Your email</span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="form-field">
                    <span>Password</span>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </label>
                  {accountError && <p className="auth-error">{accountError}</p>}
                  <button type="submit" className="form-submit quiz-create" disabled={accountBusy}>
                    {accountBusy
                      ? 'Please wait…'
                      : `Create account & start ${JOURNEY_LABELS[assignedObjective]} plan`}
                  </button>
                </form>
              )
            ) : (
              <button type="button" className="form-submit quiz-create" onClick={create}>
                Start {name.trim() || 'this player'}'s {JOURNEY_LABELS[assignedObjective]} plan
              </button>
            )}
          </section>

          <div>
            <div className="admin-preview-banner">
              Preview — {JOURNEY_LABELS[assignedObjective]} plan, {ageGroupLabel(band)}
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
