import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Journey } from '../../types'
import { formatMonthYear } from '../../utils/format'
import { journeyRatingSeries, targetJourneyRating } from '../../data/journeyDerive'
import InfoPopover from '../InfoPopover'
import RatingScale from '../journey/RatingScale'

interface Props {
  journey: Journey
  playerName?: string
}

export default function PlayerRatingTrend({ journey }: Props) {
  const series = journeyRatingSeries(journey)
  const target = targetJourneyRating(journey)
  const data = series.map((p) => ({
    label: p.label === 'Onboarding' ? 'Start' : formatMonthYear(p.date),
    rating: p.rating,
  }))

  const hasHistory = series.length > 1

  return (
    <section className="card">
      <div className="jmap-head">
        <h2>Level since joining</h2>
        <InfoPopover label="What the level means" align="right">
          <RatingScale
            objective={journey.objective}
            band={journey.band}
            value={series[series.length - 1]?.rating ?? 0}
            skillCount={journey.skillTargets.length}
          />
        </InfoPopover>
      </div>
      <p className="section-subtitle">
        Each dot is a coach update. The goal is {target.toFixed(1)}.
      </p>

      {hasHistory ? (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={data} margin={{ top: 20, right: 16, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="playerRatingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--gridline)" />
              <XAxis
                dataKey="label"
                stroke="var(--border)"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} / 5`, 'Journey rating']}
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  boxShadow: 'var(--shadow-md)',
                  fontSize: 13,
                }}
              />
              <ReferenceLine
                y={target}
                stroke="var(--text-muted)"
                strokeDasharray="4 4"
                label={{
                  value: `goal ${target.toFixed(1)}`,
                  fill: 'var(--text-muted)',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
              />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="none"
                fill="url(#playerRatingFill)"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--surface)', strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: 'var(--surface)', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="jrny-empty">
          Just the starting point so far — this fills in as the coach adds updates.
        </p>
      )}
    </section>
  )
}
