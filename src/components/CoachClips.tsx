import { useState } from 'react'
import type { BandDefinition, CoachClip } from '../types'
import { formatDate, formatDuration } from '../utils/format'
import BadmintonIllustration from './icons/BadmintonIllustration'

interface Props {
  clips: CoachClip[]
  bandDef: BandDefinition
}

export default function CoachClips({ clips, bandDef }: Props) {
  const [openClip, setOpenClip] = useState<CoachClip | null>(null)

  return (
    <section className="card">
      <h2>Coach clips</h2>
      <p className="section-subtitle">
        Short breakdowns from the coach reviewing session footage — tap a clip to read along
      </p>
      <div className="clip-grid">
        {clips.map((clip, i) => {
          const metricLabel = clip.metricKey
            ? bandDef.metrics.find((m) => m.key === clip.metricKey)?.label
            : undefined

          return (
            <button
              type="button"
              className="clip-card"
              key={clip.id}
              onClick={() => setOpenClip(clip)}
            >
              <div className="clip-thumb">
                <BadmintonIllustration paletteIndex={i + 1} flip={i % 2 === 1} />
                <div className="media-play-overlay" aria-hidden="true">
                  <span className="media-play-btn">▶</span>
                </div>
                <span className="clip-duration">{formatDuration(clip.durationSeconds)}</span>
              </div>
              <span className="clip-title">{clip.title}</span>
              <span className="clip-meta">
                {formatDate(clip.date)}
                {metricLabel && <span className="clip-tag">{metricLabel}</span>}
              </span>
            </button>
          )
        })}
      </div>

      {openClip && (
        <div className="diary-modal-backdrop" onClick={() => setOpenClip(null)}>
          <div
            className="diary-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="diary-modal-header">
              <h3>{openClip.title}</h3>
              <button
                type="button"
                className="diary-modal-close"
                onClick={() => setOpenClip(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="clip-modal-meta">
              {formatDate(openClip.date)} · {formatDuration(openClip.durationSeconds)}
            </div>
            <p className="clip-transcript-label">Transcript</p>
            <p className="clip-transcript">{openClip.transcript}</p>
          </div>
        </div>
      )}
    </section>
  )
}
