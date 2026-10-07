import type { Assessment } from '../types'
import { formatDate } from '../utils/format'
import BadmintonIllustration from './icons/BadmintonIllustration'

interface Props {
  assessments: Assessment[]
}

export default function MediaJournal({ assessments }: Props) {
  const items = assessments
    .slice()
    .reverse()
    .flatMap((a) => a.media.map((m) => ({ ...m, date: a.date, assessmentId: a.id })))

  return (
    <section className="card">
      <h2>Media journal</h2>
      <p className="section-subtitle">Photos and videos tied to each check-in</p>
      <div className="media-scroll">
        {items.map((item, i) => (
          <div className="media-tile" key={`${item.assessmentId}-${i}`}>
            <div className="media-thumb">
              <BadmintonIllustration paletteIndex={i} flip={i % 2 === 1} />
              {item.type === 'video' && (
                <div className="media-play-overlay" aria-hidden="true">
                  <span className="media-play-btn">▶</span>
                </div>
              )}
            </div>
            <div className="media-caption">{item.caption}</div>
            <div className="media-date">{formatDate(item.date)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
