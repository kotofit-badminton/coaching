import { useState } from 'react'

export interface NavItem {
  id: string
  label: string
  desc: string
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

interface Props {
  groups: NavGroup[]
  value: string
  onChange: (id: string) => void
  /** 'drawer' = hidden behind ☰ (overview). 'sidebar' = always-visible column (sub-pages). */
  mode: 'drawer' | 'sidebar'
}

function List({
  groups,
  value,
  onChange,
}: Pick<Props, 'groups' | 'value' | 'onChange'>) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <div className="player-nav-list">
      {groups.map((group, gi) => {
        const key = group.title ?? String(gi)
        const hasActive = group.items.some((item) => item.id === value)
        const open = group.title ? (expanded[key] ?? hasActive) : true
        return (
          <div className={`player-nav-group${open ? '' : ' collapsed'}`} key={key}>
            {group.title && (
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
                <span className="player-nav-item-desc">{item.desc}</span>
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default function PlayerNav({ groups, value, onChange, mode }: Props) {
  const [open, setOpen] = useState(false)

  if (mode === 'sidebar') {
    return (
      <nav className="player-nav-side" aria-label="Sections">
        <List groups={groups} value={value} onChange={onChange} />
      </nav>
    )
  }

  return (
    <>
      <button
        type="button"
        className="player-menu-btn"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open sections menu"
      >
        <span className="player-nav-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="player-menu-btn-text">Sections</span>
      </button>

      {open && (
        <>
          <div className="player-drawer-backdrop" onClick={() => setOpen(false)} />
          <aside className="player-drawer" role="dialog" aria-label="Sections">
            <div className="player-drawer-head">
              <span>Sections</span>
              <button
                type="button"
                className="player-drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <List
              groups={groups}
              value={value}
              onChange={(id) => {
                onChange(id)
                setOpen(false)
              }}
            />
          </aside>
        </>
      )}
    </>
  )
}
