import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Band, Objective } from '../../types'
import { useStore } from '../../data/store'
import { objectiveLabels } from '../../data/journeyTemplates'
import { ageGroupLabel } from '../../data/definitions'
import type { ClassPrefill } from './ObjectiveGroups'

const OBJECTIVES: Objective[] = ['fun', 'fitness', 'competitive']
const BANDS: Band[] = ['A', 'B']

interface Props {
  prefill: ClassPrefill | null
  onConsumePrefill: () => void
}

export default function Classes({ prefill, onConsumePrefill }: Props) {
  const { players, classes, getPlayer, createClass, setClassMembers } = useStore()

  const [name, setName] = useState('')
  const [objective, setObjective] = useState<Objective>('fun')
  const [band, setBand] = useState<Band>('A')
  const [coachName, setCoachName] = useState('Coach Dan')
  const [schedule, setSchedule] = useState('Sat · 10:00–11:00am')
  const [capacity, setCapacity] = useState(10)
  const [memberIds, setMemberIds] = useState<string[]>([])

  useEffect(() => {
    if (!prefill) return
    setName(prefill.name)
    setObjective(prefill.objective)
    setBand(prefill.band)
    setMemberIds(prefill.memberIds)
    onConsumePrefill()
  }, [prefill])

  const eligible = players.filter((p) => p.objective === objective && p.band === band)

  function toggleMember(id: string) {
    setMemberIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    createClass({
      name: name.trim(),
      objective,
      band,
      coachName: coachName.trim() || 'Coach',
      schedule: schedule.trim(),
      capacity,
      memberIds: memberIds.filter((id) => eligible.some((p) => p.id === id)),
    })
    setName('')
    setMemberIds([])
  }

  return (
    <div className="admin-classes">
      <form className="card admin-form" onSubmit={submit}>
        <h2>Create a class</h2>
        <p className="section-subtitle">
          Group players who share an objective and band into a scheduled class.
        </p>

        <div className="form-row">
          <label className="form-field">
            <span>Class name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Junior Competitive · Ages 9–13" />
          </label>
        </div>

        <div className="form-row">
          <label className="form-field form-field-sm">
            <span>Objective</span>
            <select value={objective} onChange={(e) => setObjective(e.target.value as Objective)}>
              {OBJECTIVES.map((o) => (
                <option key={o} value={o}>
                  {objectiveLabels[o]}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field form-field-sm">
            <span>Age group</span>
            <select value={band} onChange={(e) => setBand(e.target.value as Band)}>
              {BANDS.map((b) => (
                <option key={b} value={b}>
                  {ageGroupLabel(b)}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field form-field-sm">
            <span>Capacity</span>
            <input
              type="number"
              min={1}
              max={30}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value) || 1)}
            />
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span>Coach</span>
            <input value={coachName} onChange={(e) => setCoachName(e.target.value)} />
          </label>
          <label className="form-field">
            <span>Schedule</span>
            <input value={schedule} onChange={(e) => setSchedule(e.target.value)} />
          </label>
        </div>

        <fieldset className="form-fieldset">
          <legend>
            Members — {objectiveLabels[objective]} · {ageGroupLabel(band)} ({eligible.length} eligible)
          </legend>
          {eligible.length === 0 ? (
            <p className="jrny-empty">No players match this objective and band yet.</p>
          ) : (
            <div className="admin-member-checks">
              {eligible.map((p) => (
                <label key={p.id} className="admin-member-check">
                  <input
                    type="checkbox"
                    checked={memberIds.includes(p.id)}
                    onChange={() => toggleMember(p.id)}
                  />
                  {p.name} <span className="admin-member-meta">age {p.age}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <button type="submit" className="form-submit" disabled={!name.trim()}>
          Create class
        </button>
      </form>

      <div className="admin-class-list">
        <h2 className="admin-class-list-title">Classes ({classes.length})</h2>
        {classes.map((c) => {
          const addable = players.filter(
            (p) =>
              p.objective === c.objective &&
              p.band === c.band &&
              !c.memberIds.includes(p.id),
          )
          return (
            <div className="card class-card" key={c.id}>
              <div className="class-card-head">
                <span className="class-card-name">{c.name}</span>
                <span className={`jrny-objective-pill obj-${c.objective}`}>
                  {objectiveLabels[c.objective]}
                </span>
              </div>
              <div className="class-card-meta">
                {ageGroupLabel(c.band)} · {c.coachName} · {c.schedule} · {c.memberIds.length}/{c.capacity}
              </div>
              <div className="class-card-members">
                {c.memberIds.map((id) => {
                  const p = getPlayer(id)
                  if (!p) return null
                  return (
                    <span className="class-member-chip" key={id}>
                      <Link to={`/player/${id}`}>{p.name}</Link>
                      <button
                        type="button"
                        aria-label={`Remove ${p.name}`}
                        onClick={() =>
                          setClassMembers(
                            c.id,
                            c.memberIds.filter((x) => x !== id),
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
                {c.memberIds.length === 0 && (
                  <span className="jrny-empty">No members yet.</span>
                )}
              </div>
              {addable.length > 0 && c.memberIds.length < c.capacity && (
                <label className="class-add-member">
                  <span>Add player</span>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) setClassMembers(c.id, [...c.memberIds, e.target.value])
                    }}
                  >
                    <option value="">Choose…</option>
                    {addable.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
