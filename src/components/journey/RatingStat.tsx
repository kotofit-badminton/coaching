import { useState } from 'react'
import type { Band, Objective } from '../../types'
import RatingScale from './RatingScale'

interface Props {
  label: string
  value: number
  sub?: string
  objective: Objective
  band: Band
  skillCount: number
}

/** A stat tile whose value and "i" both open a plain-language rating explainer. */
export default function RatingStat({ label, value, sub, objective, band, skillCount }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="review-stat rating-stat">
      <button
        type="button"
        className="review-stat-value rating-stat-value"
        onClick={() => setOpen((o) => !o)}
      >
        {value.toFixed(1)}
        {sub && <span className="review-stat-sub">{sub}</span>}
      </button>
      <span className="review-stat-label rating-stat-label">
        {label}
        <button
          type="button"
          className="info-icon-btn"
          aria-label="What the rating means"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          i
        </button>
      </span>
      {open && (
        <>
          <div className="info-popover-backdrop" onClick={() => setOpen(false)} />
          <div className="info-popover rating-popover" role="tooltip">
            <RatingScale objective={objective} band={band} value={value} skillCount={skillCount} />
          </div>
        </>
      )}
    </div>
  )
}
