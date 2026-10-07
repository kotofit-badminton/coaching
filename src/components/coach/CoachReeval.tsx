import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Objective } from '../../types'
import { useStore } from '../../data/store'
import { getBandDefinition } from '../../data/definitions'
import { objectiveBlurbs, objectiveLabels } from '../../data/journeyTemplates'

const OBJECTIVES: Objective[] = ['fun', 'fitness', 'competitive']
const TODAY = '2026-08-30'

interface Props {
  playerId: string
}

/** Coach re-evaluation: re-score the player and (optionally) change track. Regenerates the journey. */
export default function CoachReeval({ playerId }: Props) {
  const { getPlayer, getOnboarding, reevaluatePlayer } = useStore()
  const player = getPlayer(playerId)
  const onboarding = getOnboarding(playerId)

  const [objective, setObjective] = useState<Objective>(player?.objective ?? 'fun')
  const [scores, setScores] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!player) return
    setObjective(player.objective)
    setScores(onboarding?.baselineScores ?? {})
    setNotes('')
    setSaved(false)
  }, [playerId])

  if (!player) {
    return (
      <section className="card">
        <p className="jrny-empty">Pick a player to re-evaluate.</p>
      </section>
    )
  }

  const metrics = getBandDefinition(player.band).metrics
  const objectiveChanged = objective !== player.objective

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const baselineScores: Record<string, number> = {}
    for (const m of metrics) baselineScores[m.key] = scores[m.key] ?? 2.5
    reevaluatePlayer(playerId, {
      objective,
      baselineScores,
      notes: notes.trim() || undefined,
      date: TODAY,
    })
    setSaved(true)
  }

  return (
    <form className="card admin-form" onSubmit={submit}>
      <h2>Redo {player.name}'s assessment</h2>
      <p className="section-subtitle">
        Score the skills again and, if it fits better, switch plan. The plan is rebuilt from
        the new picture; past updates are kept.
      </p>

      <fieldset className="form-fieldset">
        <legend>Plan</legend>
        <div className="form-radio-row">
          {OBJECTIVES.map((obj) => (
            <label
              key={obj}
              className={`form-radio obj-${obj}${objective === obj ? ' active' : ''}`}
            >
              <input
                type="radio"
                name="reeval-objective"
                checked={objective === obj}
                onChange={() => setObjective(obj)}
              />
              <span className="form-radio-title">
                {objectiveLabels[obj]}
                {obj === player.objective && (
                  <span className="form-radio-blurb"> · current</span>
                )}
              </span>
              <span className="form-radio-blurb">{objectiveBlurbs[obj]}</span>
            </label>
          ))}
        </div>
        {objectiveChanged && (
          <p className="coach-reeval-warn">
            Switching plan rebuilds everything — new steps, drills, goals and timeline.
          </p>
        )}
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>How each skill is now (1–5)</legend>
        {metrics.map((m) => {
          const v = scores[m.key] ?? 2.5
          return (
            <div className="form-slider-row" key={m.key}>
              <div className="form-slider-head">
                <span className="form-slider-label">{m.label}</span>
                <span className="form-slider-value">{v.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={v}
                onChange={(e) => setScores((s) => ({ ...s, [m.key]: Number(e.target.value) }))}
              />
              <span className="form-slider-anchor">
                {m.anchors[Math.min(5, Math.max(1, Math.round(v))) as 1 | 2 | 3 | 4 | 5]}
              </span>
            </div>
          )
        })}
      </fieldset>

      <label className="form-field">
        <span>Evaluation note</span>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What's changed since last time, and why the new scores."
        />
      </label>

      <div className="admin-form-actions">
        <button type="submit" className="form-submit">
          Save assessment
        </button>
        {saved && (
          <span className="admin-saved">
            Plan rebuilt · <Link to={`/player/${playerId}`}>view {player.name}'s plan</Link>
          </span>
        )}
      </div>
    </form>
  )
}
