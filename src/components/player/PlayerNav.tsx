import { useState } from 'react'

export interface NavItem {
  id: string
  label: string
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

interface Props {
  groups: NavGroup[]
  value: string
  onChange: (id: string) => void
}

export default function PlayerNav({ groups, value, onChange }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <nav className="player-nav-side" aria-label="Sections">
      <div className="player-nav-list">
        {groups.map((group, gi) => {
          const key = group.title ?? String(gi)
          const hasActive = group.items.some((item) => item.id === value)
          const showTitle = Boolean(group.title) && group.items.length > 1
          const open = showTitle ? (expanded[key] ?? hasActive) : true
          return (
            <div className={`player-nav-group${open ? '' : ' collapsed'}`} key={key}>
              {showTitle && (
                <button
                  type="button"
                  className="player-nav-group-title"
                  aria-expanded={open}
                  onClick={() => setExpanded((e) => ({ ...e, [key]: !open }))}
                >
                  {group.title}
                  <span className="player-nav-group-chevron" aria-hidden="true">
                    ›
                  </span>
                </button>
              )}
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`player-nav-item${value === item.id ? ' active' : ''}`}
                  onClick={() => onChange(item.id)}
                  aria-current={value === item.id ? 'page' : undefined}
                >
                  <span className="player-nav-item-label">{item.label}</span>
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
