import type { Match } from '../types'
import { formatDate } from '../utils/format'

interface Props {
  matches: Match[]
}

function MatchCard({ match }: { match: Match }) {
  const scoreLine = match.games.map((g) => `${g.playerScore}-${g.opponentScore}`).join(', ')

  return (
    <div className={`match-card ${match.result}`}>
      <div className="match-card-header">
        <span className="match-vs">Vikram vs {match.opponentName}</span>
        <span className={`match-result-badge ${match.result}`}>
          {match.result === 'win' ? 'Win' : 'Loss'}
        </span>
      </div>
      {match.eventName && <div className="match-event">{match.eventName}</div>}
      <div className="match-score">{scoreLine}</div>
      <div className="match-date">{formatDate(match.date)}</div>
      {match.notes && <p className="match-notes">{match.notes}</p>}
    </div>
  )
}

export default function Matches({ matches }: Props) {
  const friendly = matches
    .filter((m) => m.type === 'friendly')
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  const tournaments = matches
    .filter((m) => m.type === 'tournament')
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  const wins = matches.filter((m) => m.result === 'win').length

  return (
    <section className="card">
      <h2>Matches</h2>
      <p className="section-subtitle">
        {wins}–{matches.length - wins} record across {matches.length} friendly matches and
        tournaments
      </p>

      <div className="goals-group">
        <h3 className="goals-group-title">Friendly matches &amp; leagues</h3>
        <p className="match-group-hint">In-house matches played with other players at the academy</p>
        <div className="match-list">
          {friendly.map((m) => (
            <MatchCard match={m} key={m.id} />
          ))}
        </div>
      </div>

      <div className="goals-group">
        <h3 className="goals-group-title">Tournaments</h3>
        <p className="match-group-hint">Official open tournaments outside the academy</p>
        <div className="match-list">
          {tournaments.map((m) => (
            <MatchCard match={m} key={m.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
