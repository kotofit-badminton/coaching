import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../data/store'
import { ageGroupLabel, getBandDefinition, metricLabel } from '../../data/definitions'
import { objectiveLabels } from '../../data/journeyTemplates'

const TODAY = '2026-08-30'

interface Props {
  /** When set, the form logs against this player and hides the player picker. */
  playerId?: string
}

export default function CoachLog({ playerId: fixedId }: Props) {
  const { players, getPlayer, getJourney, getOnboarding, logJourneyProgress, addSessionNote } =
    useStore()

  const [pickedId, setPickedId] = useState(players[0]?.id ?? '')
  const playerId = fixedId ?? pickedId

  const [date, setDate] = useState(TODAY)
  const [classesCompleted, setClassesCompleted] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [coachNote, setCoachNote] = useState('')
  const [sessionFocus, setSessionFocus] = useState('')
  const [saved, setSaved] = useState(false)

  const player = getPlayer(playerId)
  const journey = getJourney(playerId)
  const onboarding = getOnboarding(playerId)

  useEffect(() => {
    if (!journey) return
    setClassesCompleted(journey.classesCompleted + journey.projection.classesPerWeek)
    setScores(Object.fromEntries(journey.skillTargets.map((t) => [t.metricKey, t.current])))
    setCoachNote('')
    setSessionFocus('')
    setSaved(false)
  }, [playerId, journey?.id])

  const metricLabels = useMemo(() => {
    if (!player) return {}
    const def = getBandDefinition(player.band)
    return Object.fromEntries(def.metrics.map((m) => [m.key, m.label]))
  }, [player])

  if (!player || !journey) {
    return (
      <section className="card">
        <p className="jrny-empty">Pick a player who has a plan to add an update for.</p>
      </section>
    )
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    logJourneyProgress(playerId, { classesCompleted, scores, coachNote: coachNote.trim(), date })
    if (sessionFocus.trim()) {
      addSessionNote({
        playerId,
        date,
        author: 'coach',
        authorName: onboarding?.coachName ?? 'Coach',
        focus: sessionFocus.trim(),
        note: coachNote.trim() || sessionFocus.trim(),
      })
    }
    setSaved(true)
  }

  return (
    <form className="card admin-form" onSubmit={submit}>
      <h2>Add an update</h2>
      <p className="section-subtitle">
        Note how many classes they've done and where each skill is now (1–5). This moves the
        player's level, progress bar and goals.
      </p>

      <div className="form-row">
        {!fixedId && (
          <label className="form-field">
            <span>Player</span>
            <select value={pickedId} onChange={(e) => setPickedId(e.target.value)}>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {ageGroupLabel(p.band)} · {objectiveLabels[p.objective]}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="form-field form-field-sm">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="form-field form-field-sm">
          <span>Classes done (total)</span>
          <input
            type="number"
            min={0}
            max={journey.projection.totalClasses}
            value={classesCompleted}
            onChange={(e) => setClassesCompleted(Number(e.target.value) || 0)}
          />
        </label>
      </div>

      <fieldset className="form-fieldset">
        <legend>How each skill is now (1–5)</legend>
        {journey.skillTargets.map((t) => {
          const v = scores[t.metricKey] ?? t.current
          return (
            <div className="form-slider-row" key={t.metricKey}>
              <div className="form-slider-head">
                <span className="form-slider-label">
                  {metricLabels[t.metricKey] ?? metricLabel(player.band, t.metricKey)}
                </span>
                <span className="form-slider-value">
                  {v.toFixed(1)}{' '}
                  <span className="form-slider-target">/ target {t.target.toFixed(1)}</span>
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={v}
                onChange={(e) =>
                  setScores((s) => ({ ...s, [t.metricKey]: Number(e.target.value) }))
                }
              />
            </div>
          )
        })}
      </fieldset>

      <label className="form-field">
        <span>Coach note</span>
        <textarea
          rows={3}
          value={coachNote}
          onChange={(e) => setCoachNote(e.target.value)}
          placeholder="What moved, what's next."
        />
      </label>

      <label className="form-field">
        <span>Also add a session-diary entry (optional focus)</span>
        <input
          value={sessionFocus}
          onChange={(e) => setSessionFocus(e.target.value)}
          placeholder="e.g. 6-corner footwork under pressure"
        />
      </label>

      <div className="admin-form-actions">
        <button type="submit" className="form-submit">
          Save update
        </button>
        {saved && (
          <span className="admin-saved">
            Saved · <Link to={`/player/${playerId}`}>view {player.name}'s plan</Link>
          </span>
        )}
      </div>
    </form>
  )
}
