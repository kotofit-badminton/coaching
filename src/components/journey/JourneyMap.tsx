import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { Band, Journey } from '../../types'
import { drillTemplateById } from '../../data/drillLibrary'
import { metricLabel } from '../../data/definitions'
import { capabilityLine, intensityLabels, objectiveLabels } from '../../data/journeyTemplates'
import { currentWeekNumber } from '../../data/journeyDerive'
import courtImg from '../../assets/court-shuttles.jpg'

interface Props {
  journey: Journey
  band: Band
  subjectName?: string
}

interface Pt {
  x: number
  y: number
}

/** Catmull-Rom → cubic-bezier smoothing so the trail flows instead of zig-zags. */
function smoothPath(pts: Pt[], tension = 0.2): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x} ${pts[0].y}` : ''
  const d = [`M ${pts[0].x} ${pts[0].y}`]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1.x + ((p2.x - p0.x) * tension)
    const c1y = p1.y + ((p2.y - p0.y) * tension)
    const c2x = p2.x - ((p3.x - p1.x) * tension)
    const c2y = p2.y - ((p3.y - p1.y) * tension)
    d.push(`C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x} ${p2.y}`)
  }
  return d.join(' ')
}

// Phones get the vertical trail; larger screens get the horizontal one.
function useIsPhone() {
  const [phone, setPhone] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setPhone(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return phone
}

export default function JourneyMap({ journey, band, subjectName = 'They' }: Props) {
  const weeks = journey.weeklyPlan ?? []
  const total = weeks.length
  const perWeek = journey.projection.classesPerWeek
  const weeksDone = Math.floor(journey.classesCompleted / Math.max(1, perWeek))
  const currentWeek = currentWeekNumber(journey)

  const [selected, setSelected] = useState<number | null>(currentWeek)

  const isPhone = useIsPhone()
  // Phones: one week per row, winding down. Larger screens: two snaking rows, scrolled sideways.
  const rowH = isPhone ? 15 : 30
  const cols = isPhone ? 1 : Math.ceil(total / 2)
  const colW = 11
  const scale = 5
  const vbW = isPhone ? 100 : cols * colW + 12
  const vbH = isPhone ? total * rowH + 14 : 64

  const pos = useMemo<Pt[]>(() => {
    if (isPhone) {
      return weeks.map((_, i) => ({
        x: 50 + Math.sin((i + 0.5) * 0.8) * 24,
        y: 10 + i * rowH,
      }))
    }
    return weeks.map((_, i) => {
      const row = Math.floor(i / cols)
      const c = i % cols
      const col = row % 2 === 0 ? c : cols - 1 - c
      // gentle drift along each row, like the original trail
      const drift = Math.sin((col + 0.5) * 0.9) * 4
      return { x: 8 + col * colW, y: 18 + row * rowH + drift }
    })
  }, [weeks, isPhone, rowH, cols])

  const phases = journey.phases ?? []
  const checkpointByWeek = new Map((journey.checkpoints ?? []).map((c) => [c.atWeek, c]))
  const phaseColor = (name: string) => {
    const idx = phases.findIndex((p) => p.name === name)
    return ['var(--accent)', 'var(--aqua)', 'var(--violet)', 'var(--gold)', 'var(--player-accent)'][
      (idx < 0 ? 0 : idx) % 5
    ]
  }

  if (total === 0 || phases.length === 0) {
    return (
      <section className="card jmap">
        <h2>Your plan, week by week</h2>
        <p className="jrny-empty">
          This plan needs rebuilding — use “Reset demo data” in the header.
        </p>
      </section>
    )
  }

  const trailD = smoothPath(pos)
  const doneFrac = Math.min(1, Math.max(0, weeksDone / Math.max(1, total - 1)))
  const segVar = (name: string): CSSProperties =>
    ({ '--seg': phaseColor(name) }) as CSSProperties

  const select = (week: number | null) => {
    setSelected(week)
    if (week != null) {
      requestAnimationFrame(() => {
        document
          .getElementById(`jmap-w-${week}`)
          ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      })
    }
  }

  const sel = selected != null ? weeks.find((w) => w.week === selected) : undefined
  const selIdx = sel ? sel.week - 1 : -1
  const selPt = selIdx >= 0 ? pos[selIdx] : null
  const selCheckpoint = sel ? checkpointByWeek.get(sel.week) : undefined
  const selPhase = sel ? phases.find((p) => p.name === sel.phase) : undefined

  // popover placement
  const xPct = selPt ? (selPt.x / vbW) * 100 : 50
  const align = selPt == null ? 'center' : xPct < 30 ? 'left' : xPct > 70 ? 'right' : 'center'
  const flipDown = selPt != null && selPt.y < vbH / 2 // near the top → open downward

  return (
    <section className="card jmap">
      <div className="jmap-head">
        <h2>Your plan, week by week</h2>
        <span className={`jrny-objective-pill obj-${journey.objective}`}>
          {objectiveLabels[journey.objective]} · {total} weeks · {perWeek} a week
        </span>
      </div>
      <p className="section-subtitle">
        {phases.length} steps over {total} weeks. Tap a week on the trail to see what's in it.
      </p>
      <p className="jmap-goal">
        <span className="jmap-goal-label">Where it leads</span> {journey.targetSummary}
      </p>

      <div className="jmap-phases">
        {phases.map((p) => {
          const state =
            journey.classesCompleted >= p.endClass
              ? 'done'
              : currentWeek >= p.startWeek
                ? 'current'
                : 'future'
          return (
            <div
              key={p.name}
              className={`jmap-phase-seg ${state}`}
              style={{ flexGrow: p.endWeek - p.startWeek + 1, ...segVar(p.name) }}
              title={`${p.name} — weeks ${p.startWeek}–${p.endWeek}`}
            >
              <span className="jmap-phase-name">{p.name}</span>
              <span className="jmap-phase-weeks">wk {p.startWeek}–{p.endWeek}</span>
            </div>
          )
        })}
      </div>

      <div
        className="jmap-board"
        style={{ ['--jmap-bg' as string]: `url(${courtImg})` } as CSSProperties}
      >
        <div
          className="jmap-canvas"
          style={isPhone ? undefined : { width: vbW * scale, maxWidth: 'none' }}
        >
          {selected != null && (
            <button
              type="button"
              className="jmap-pop-backdrop"
              aria-label="Close"
              onClick={() => setSelected(null)}
            />
          )}
          <svg
            viewBox={`0 0 ${vbW} ${vbH}`}
            className="jmap-svg"
            role="img"
            aria-label="Journey trail"
            onClick={() => setSelected(null)}
          >
            <path d={trailD} className="jmap-trail" pathLength={1} />
            <path
              d={trailD}
              className="jmap-trail-done"
              pathLength={1}
              style={{ strokeDasharray: `${doneFrac} 1` }}
            />
            {weeks.map((w, i) => {
              const p = pos[i]
              const cp = checkpointByWeek.get(w.week)
              const done = w.week <= weeksDone
              const isCurrent = w.week === currentWeek
              const isSel = w.week === selected
              const cls = [
                'jmap-node',
                cp ? 'milestone' : '',
                done ? 'done' : isCurrent ? 'current' : 'future',
                isSel ? 'sel' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <g
                  key={w.week}
                  id={`jmap-w-${w.week}`}
                  className={cls}
                  transform={`translate(${p.x} ${p.y})`}
                  onClick={(e) => {
                    e.stopPropagation()
                    select(isSel ? null : w.week)
                  }}
                  style={{ cursor: 'pointer', ...segVar(w.phase) }}
                >
                  <circle r={cp ? 6.2 : 5} className="jmap-node-halo" />
                  {isSel && <circle r={cp ? 7.2 : 6} className="jmap-node-ring" />}
                  <circle r={cp ? 4.8 : 3.7} className="jmap-node-dot" />
                  {cp ? (
                    <text className="jmap-node-star" y="1.7" textAnchor="middle">
                      ★
                    </text>
                  ) : (
                    <text className="jmap-node-num" y="1.5" textAnchor="middle">
                      {w.week}
                    </text>
                  )}
                  {i === weeks.length - 1 && (
                    <text className="jmap-node-flag" y={-8.5} textAnchor="middle">
                      🏆
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {sel && selPt && (
            <div
              className={`jmap-pop al-${align} ${flipDown ? 'flip-down' : 'flip-up'}`}
              style={{ left: `${xPct}%`, top: `${(selPt.y / vbH) * 100}%` }}
              role="dialog"
              aria-label={`Week ${sel.week}`}
            >
              <button
                type="button"
                className="jmap-pop-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="jmap-pop-head">
                <span className="jmap-pop-week">Week {sel.week}</span>
                <span className="jmap-detail-phase" style={segVar(sel.phase)}>
                  {sel.phase}
                </span>
                <span className={`jmap-intensity int-${sel.intensity}`}>
                  {intensityLabels[sel.intensity]}
                </span>
              </div>
              <p className="jmap-pop-summary">{sel.summary}</p>
              <div className="jmap-pop-row">
                <span className="jmap-detail-label">Focus</span>
                <div className="jrny-week-drills">
                  {sel.focusMetricKeys.map((k) => (
                    <span className="jrny-drill-chip" key={k}>
                      {metricLabel(band, k)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="jmap-pop-row">
                <span className="jmap-detail-label">Drills</span>
                <div className="jrny-week-drills">
                  {sel.drillIds.map((id) => (
                    <span className="jrny-drill-chip" key={id}>
                      {drillTemplateById[id]?.name ?? id}
                    </span>
                  ))}
                </div>
              </div>
              {selCheckpoint && (
                <div className={`jmap-achieve${selCheckpoint.done ? ' done' : ''}`}>
                  <span className="jmap-achieve-eyebrow">
                    {selCheckpoint.done ? '★ Reached' : '★ Goal at this point'}
                  </span>
                  <span className="jmap-achieve-title">{selCheckpoint.label}</span>
                  <span className="jmap-achieve-cap">
                    {capabilityLine(subjectName, selCheckpoint.capability, selCheckpoint.done)}
                  </span>
                  {selPhase && (
                    <span className="jmap-achieve-at">
                      End of “{selPhase.name}” · about session {selCheckpoint.atClass}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="jmap-weekstrip" role="tablist" aria-label="Weeks">
        {weeks.map((w) => (
          <button
            key={w.week}
            type="button"
            role="tab"
            aria-selected={selected === w.week}
            className={`jmap-weekchip${selected === w.week ? ' active' : ''}${
              checkpointByWeek.has(w.week) ? ' milestone' : ''
            }`}
            onClick={() => select(selected === w.week ? null : w.week)}
          >
            W{w.week}
          </button>
        ))}
      </div>
    </section>
  )
}
