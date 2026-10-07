import type { Band, Objective } from '../../types'
import { ageGroupLabel } from '../../data/definitions'
import { objectiveLabels } from '../../data/journeyTemplates'

export const RATING_LEVELS = [
  { n: 1, label: 'Just starting', desc: 'Being shown the skill for the first time.' },
  { n: 2, label: 'Finding your feet', desc: 'Can do it sometimes, slowly or with help.' },
  { n: 3, label: 'Getting confident', desc: 'Reliable in normal practice, no help needed.' },
  { n: 4, label: 'Playing well', desc: 'Holds up at speed and under a bit of pressure.' },
  { n: 5, label: 'Really strong', desc: 'Consistent even in a real match, for this plan.' },
] as const

interface Props {
  objective: Objective
  band: Band
  value: number
  skillCount: number
}

/** The "what does this number mean" content — drop inside a popover. */
export default function RatingScale({ objective, band, value, skillCount }: Props) {
  const active = Math.min(5, Math.max(1, Math.round(value)))
  return (
    <div className="rating-scale">
      <div className="rubric-popover-title">What the level means</div>
      <p className="rating-scale-intro">
        It's the average of the {skillCount} skills this plan is building, from 1 to 5. It's
        measured against a <strong>{objectiveLabels[objective].toLowerCase()}</strong> player,{' '}
        <strong>{ageGroupLabel(band).toLowerCase()}</strong> — so a 3 means genuinely competent{' '}
        <em>for this plan</em>, not next to older or competitive players.
      </p>
      <div className="rating-scale-rows">
        {RATING_LEVELS.map((l) => (
          <div key={l.n} className={`rubric-row${active === l.n ? ' active' : ''}`}>
            <span className="rubric-row-level">{l.n}</span>
            <span>
              <strong>{l.label}</strong> — {l.desc}
            </span>
          </div>
        ))}
      </div>
      <p className="rating-scale-now">
        This plan aims for about{' '}
        <strong>
          {objective === 'competitive' ? '4' : objective === 'fitness' ? '4' : '3–3.5'}
        </strong>
        .
      </p>
    </div>
  )
}
