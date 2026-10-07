import { useState } from 'react'
import type { NoteAuthor } from '../../types'
import { useStore } from '../../data/store'

const TODAY = '2026-08-30'

interface Props {
  playerId: string
  playerName: string
  date?: string
  defaultAuthor?: NoteAuthor
  lockAuthor?: boolean
  onDone: () => void
}

/** Shared "add a diary note" form — used by the player diary and the coach portal. */
export default function NoteForm({
  playerId,
  playerName,
  date: initialDate,
  defaultAuthor = 'coach',
  lockAuthor = false,
  onDone,
}: Props) {
  const { addSessionNote } = useStore()
  const [author, setAuthor] = useState<NoteAuthor>(defaultAuthor)
  const [date, setDate] = useState(initialDate ?? TODAY)
  const [focus, setFocus] = useState('')
  const [note, setNote] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    addSessionNote({
      playerId,
      date,
      author,
      authorName: author === 'coach' ? 'Coach' : playerName,
      focus: focus.trim(),
      note: note.trim(),
    })
    onDone()
  }

  return (
    <form className="card admin-form player-add-form" onSubmit={submit}>
      <div className="form-row">
        {!lockAuthor && (
          <label className="form-field form-field-sm">
            <span>From</span>
            <select value={author} onChange={(e) => setAuthor(e.target.value as NoteAuthor)}>
              <option value="coach">Coach</option>
              <option value="player">{playerName}</option>
            </select>
          </label>
        )}
        <label className="form-field form-field-sm">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="form-field">
          <span>About (optional)</span>
          <input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="e.g. Serve practice"
          />
        </label>
      </div>
      <label className="form-field">
        <span>Note</span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            author === 'coach' ? "What happened, what's next." : 'How did the session feel?'
          }
        />
      </label>
      <button type="submit" className="form-submit" disabled={!note.trim()}>
        Save note
      </button>
    </form>
  )
}
