import { useState } from 'react'
import type { BandDefinition, HomeworkTask } from '../types'
import { formatDate } from '../utils/format'

interface Props {
  tasks: HomeworkTask[]
  bandDef: BandDefinition
}

export default function Homework({ tasks, bandDef }: Props) {
  const [statuses, setStatuses] = useState<Record<string, HomeworkTask['status']>>(
    Object.fromEntries(tasks.map((t) => [t.id, t.status])),
  )

  function toggle(id: string) {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'done' ? 'pending' : 'done',
    }))
  }

  const doneCount = Object.values(statuses).filter((s) => s === 'done').length

  return (
    <section className="card">
      <h2>At-home practice</h2>
      <p className="section-subtitle">
        {doneCount} of {tasks.length} tasks done — tap to check off with your kid
      </p>
      <div className="homework-list">
        {tasks.map((task) => {
          const status = statuses[task.id]
          const isDone = status === 'done'
          const metricLabel = task.metricKey
            ? bandDef.metrics.find((m) => m.key === task.metricKey)?.label
            : undefined

          return (
            <button
              type="button"
              key={task.id}
              className={`homework-item${isDone ? ' done' : ''}`}
              onClick={() => toggle(task.id)}
              aria-pressed={isDone}
            >
              <span className={`homework-checkbox${isDone ? ' checked' : ''}`} aria-hidden="true">
                {isDone && '✓'}
              </span>
              <span className="homework-body">
                <span className="homework-title">{task.title}</span>
                <span className="homework-detail">{task.detail}</span>
                <span className="homework-meta">
                  <span>Due {formatDate(task.dueDate)}</span>
                  {metricLabel && <span className="homework-tag">{metricLabel}</span>}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
