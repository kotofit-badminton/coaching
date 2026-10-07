import { useState } from 'react'
import type { Clip } from '../../types'
import { useStore } from '../../data/store'
import { formatDate } from '../../utils/format'

const TODAY = '2026-08-30'

interface Props {
  playerId: string
  playerName: string
}

export default function PlayerClips({ playerId, playerName }: Props) {
  const { getClips } = useStore()
  const clips = getClips(playerId)
  const [adding, setAdding] = useState(false)

  const coachClips = clips.filter((c) => c.author === 'coach')
  const playerClips = clips.filter((c) => c.author === 'player')

  return (
    <section className="card">
      <div className="jmap-head">
        <h2>Clips</h2>
        <button
          type="button"
          className="reset-btn"
          onClick={() => setAdding((a) => !a)}
          aria-expanded={adding}
        >
          {adding ? 'Close' : '+ Add a clip'}
        </button>
      </div>
      <p className="section-subtitle">
        Short video and audio clips — the coach points out something to fix, and {playerName}{' '}
        saves moments worth remembering. (Placeholders here; real clips would attach a file.)
      </p>

      {adding && <AddClipForm playerId={playerId} playerName={playerName} onDone={() => setAdding(false)} />}

      <ClipGroup title="From the coach" clips={coachClips} />
      <ClipGroup title={`From ${playerName}`} clips={playerClips} />
    </section>
  )
}

function ClipGroup({ title, clips }: { title: string; clips: Clip[] }) {
  return (
    <div className="goals-group">
      <h3 className="goals-group-title">{title}</h3>
      {clips.length === 0 ? (
        <p className="jrny-empty">None yet.</p>
      ) : (
        <div className="clip-grid">
          {clips.map((c) => (
            <div className="card clip-card" key={c.id}>
              <div className="clip-thumb">
                <span className="media-play-btn" aria-hidden="true">
                  {c.kind === 'audio' ? '♪' : '▶'}
                </span>
              </div>
              <div className="clip-title">{c.title}</div>
              <div className="clip-meta">
                {c.kind === 'audio' ? 'Audio' : 'Video'} · {formatDate(c.date)} · {c.authorName}
              </div>
              <p className="clip-transcript">{c.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddClipForm({
  playerId,
  playerName,
  onDone,
}: {
  playerId: string
  playerName: string
  onDone: () => void
}) {
  const { addClip } = useStore()
  const [author, setAuthor] = useState<'coach' | 'player'>('coach')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(TODAY)
  const [kind, setKind] = useState<'video' | 'audio'>('video')
  const [note, setNote] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addClip({
      playerId,
      author,
      authorName: author === 'coach' ? 'Coach' : playerName,
      title: title.trim(),
      date,
      kind,
      note: note.trim(),
    })
    onDone()
  }

  return (
    <form className="card admin-form player-add-form" onSubmit={submit}>
      <div className="form-row">
        <label className="form-field form-field-sm">
          <span>Recorded by</span>
          <select value={author} onChange={(e) => setAuthor(e.target.value as 'coach' | 'player')}>
            <option value="coach">Coach</option>
            <option value="player">{playerName}</option>
          </select>
        </label>
        <label className="form-field form-field-sm">
          <span>Type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as 'video' | 'audio')}>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </label>
        <label className="form-field form-field-sm">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <label className="form-field">
        <span>Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Serve toss consistency" />
      </label>
      <label className="form-field">
        <span>What it shows</span>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="A sentence or two about the clip."
        />
      </label>
      <button type="submit" className="form-submit" disabled={!title.trim()}>
        Save clip
      </button>
    </form>
  )
}
