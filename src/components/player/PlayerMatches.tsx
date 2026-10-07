import { useState } from 'react'
import type { MatchGame, MatchResult, MatchType } from '../../types'
import { useStore } from '../../data/store'
import { formatDate } from '../../utils/format'

const TODAY = '2026-08-30'

interface Props {
  playerId: string
  playerName: string
}

export default function PlayerMatches({ playerId, playerName }: Props) {
  const { getMatches } = useStore()
  const matches = getMatches(playerId)
  const [adding, setAdding] = useState(false)

  const wins = matches.filter((m) => m.result === 'win').length

  return (
    <section className="card">
      <div className="jmap-head">
        <h2>Matches</h2>
        <button
          type="button"
          className="reset-btn"
          onClick={() => setAdding((a) => !a)}
          aria-expanded={adding}
        >
          {adding ? 'Close' : '+ Add a match'}
        </button>
      </div>
      <p className="section-subtitle">
        Every game {playerName} has played — friendly or tournament — with the score and a
        short note about how it went. {matches.length > 0 && (
          <>
            So far: <strong>{wins}</strong> won of {matches.length}.
          </>
        )}
      </p>

      {adding && <AddMatchForm playerId={playerId} onDone={() => setAdding(false)} />}

      {matches.length === 0 ? (
        <p className="jrny-empty">No matches logged yet.</p>
      ) : (
        <div className="match-list">
          {matches.map((m) => (
            <div className="card match-card" key={m.id}>
              <div className="match-card-header">
                <span className={`goal-status-badge ${m.result === 'win' ? 'completed' : 'in_progress'}`}>
                  {m.result === 'win' ? 'Won' : 'Lost'}
                </span>
                <span className="match-vs">vs {m.opponentName}</span>
                <span className="match-date">{formatDate(m.date)}</span>
              </div>
              <div className="match-event">
                {m.type === 'tournament' ? 'Tournament' : 'Friendly'}
                {m.eventName ? ` · ${m.eventName}` : ''}
              </div>
              <div className="match-score">
                {m.games.map((g, i) => (
                  <span key={i} className="match-score-game">
                    {g.playerScore}–{g.opponentScore}
                  </span>
                ))}
              </div>
              {m.notes && <p className="match-notes">{m.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function AddMatchForm({ playerId, onDone }: { playerId: string; onDone: () => void }) {
  const { addMatch } = useStore()
  const [date, setDate] = useState(TODAY)
  const [type, setType] = useState<MatchType>('friendly')
  const [opponent, setOpponent] = useState('')
  const [eventName, setEventName] = useState('')
  const [result, setResult] = useState<MatchResult>('win')
  const [games, setGames] = useState<MatchGame[]>([{ playerScore: 21, opponentScore: 0 }])
  const [notes, setNotes] = useState('')

  function setGame(i: number, key: keyof MatchGame, val: number) {
    setGames((gs) => gs.map((g, gi) => (gi === i ? { ...g, [key]: val } : g)))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!opponent.trim()) return
    addMatch({
      playerId,
      type,
      date,
      opponentName: opponent.trim(),
      eventName: eventName.trim() || undefined,
      result,
      games: games.filter((g) => g.playerScore || g.opponentScore),
      notes: notes.trim(),
    })
    onDone()
  }

  return (
    <form className="card admin-form player-add-form" onSubmit={submit}>
      <div className="form-row">
        <label className="form-field">
          <span>Opponent</span>
          <input value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="e.g. Surya Patel" />
        </label>
        <label className="form-field form-field-sm">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <div className="form-row">
        <label className="form-field form-field-sm">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as MatchType)}>
            <option value="friendly">Friendly</option>
            <option value="tournament">Tournament</option>
          </select>
        </label>
        <label className="form-field form-field-sm">
          <span>Result</span>
          <select value={result} onChange={(e) => setResult(e.target.value as MatchResult)}>
            <option value="win">Won</option>
            <option value="loss">Lost</option>
          </select>
        </label>
        <label className="form-field">
          <span>Event (optional)</span>
          <input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Jersey City Junior Open" />
        </label>
      </div>
      <fieldset className="form-fieldset">
        <legend>Game scores</legend>
        {games.map((g, i) => (
          <div className="form-row" key={i}>
            <label className="form-field form-field-sm">
              <span>Game {i + 1} — us</span>
              <input
                type="number"
                min={0}
                value={g.playerScore}
                onChange={(e) => setGame(i, 'playerScore', Number(e.target.value) || 0)}
              />
            </label>
            <label className="form-field form-field-sm">
              <span>Them</span>
              <input
                type="number"
                min={0}
                value={g.opponentScore}
                onChange={(e) => setGame(i, 'opponentScore', Number(e.target.value) || 0)}
              />
            </label>
          </div>
        ))}
        {games.length < 3 && (
          <button
            type="button"
            className="reset-btn"
            onClick={() => setGames((gs) => [...gs, { playerScore: 0, opponentScore: 0 }])}
          >
            + Another game
          </button>
        )}
      </fieldset>
      <label className="form-field">
        <span>Notes</span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it go? What to work on?"
        />
      </label>
      <button type="submit" className="form-submit" disabled={!opponent.trim()}>
        Save match
      </button>
    </form>
  )
}
