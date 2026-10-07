import { useState, type ReactNode } from 'react'

export interface ProgressTab {
  id: string
  label: string
  content: ReactNode
}

interface Props {
  tabs: ProgressTab[]
}

// One panel at a time. Remounted per player via the parent's key, so it starts on the first tab.
export default function ProgressTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0].id)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <div className="progress-tabs">
      <div className="progress-tabs-bar" role="tablist" aria-label="Progress sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={current.id === t.id}
            className={`progress-tab${current.id === t.id ? ' active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current.content}</div>
    </div>
  )
}
