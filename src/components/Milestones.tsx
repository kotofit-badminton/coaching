import { useState } from 'react'
import type { Milestone } from '../types'
import { formatDate } from '../utils/format'
import MilestoneIcon from './icons/MilestoneIcon'

interface Props {
  milestones: Milestone[]
}

export default function Milestones({ milestones }: Props) {
  const [celebrating, setCelebrating] = useState<Milestone | null>(null)
  const unlocked = milestones
    .filter((m) => m.unlockedDate)
    .sort((a, b) => (a.unlockedDate! < b.unlockedDate! ? 1 : -1))
  const inProgress = milestones.filter((m) => !m.unlockedDate)

  return (
    <section className="card">
      <h2>Milestones &amp; badges</h2>
      <p className="section-subtitle">Unlocked achievements and what's next — tap a badge to revisit it</p>

      {inProgress.length > 0 && (
        <div className="milestone-in-progress-list">
          {inProgress.map((m) => {
            const pct = m.progress
              ? Math.min(100, Math.round((m.progress.current / m.progress.target) * 100))
              : 0
            return (
              <div className="milestone-progress-card" key={m.id}>
                <span className={`badge-icon dim ${m.badgeIcon}`}>
                  <MilestoneIcon icon={m.badgeIcon} />
                </span>
                <div className="milestone-progress-body">
                  <div className="milestone-title">{m.title}</div>
                  <div className="milestone-desc">{m.description}</div>
                  {m.progress && (
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  {m.progress && (
                    <div className="progress-label">
                      {m.progress.current} / {m.progress.target} {m.progress.unit}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ol className="milestone-timeline">
        {unlocked.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              className="milestone-item-btn"
              onClick={() => setCelebrating(m)}
            >
              <span className={`badge-icon ${m.badgeIcon}`}>
                <MilestoneIcon icon={m.badgeIcon} />
              </span>
              <span className="milestone-item-text">
                <span className="milestone-title">{m.title}</span>
                <span className="milestone-desc">{m.description}</span>
                <span className="milestone-date">{formatDate(m.unlockedDate!)}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {celebrating && (
        <div className="celebration-backdrop" onClick={() => setCelebrating(null)}>
          <div
            className="celebration-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="diary-modal-close celebration-close"
              onClick={() => setCelebrating(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="celebration-badge-wrap">
              <span className="celebration-confetti" aria-hidden="true">
                <span className="confetti-dot c1" />
                <span className="confetti-dot c2" />
                <span className="confetti-dot c3" />
                <span className="confetti-dot c4" />
                <span className="confetti-dot c5" />
              </span>
              <span className={`badge-icon celebration-badge ${celebrating.badgeIcon}`}>
                <MilestoneIcon icon={celebrating.badgeIcon} size={38} />
              </span>
            </div>
            <div className="celebration-eyebrow">Badge unlocked</div>
            <h3 className="celebration-title">{celebrating.title}</h3>
            <p className="celebration-desc">{celebrating.description}</p>
            <div className="celebration-date">{formatDate(celebrating.unlockedDate!)}</div>
          </div>
        </div>
      )}
    </section>
  )
}
