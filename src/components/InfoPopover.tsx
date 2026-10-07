import { useState, type ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
  align?: 'left' | 'right'
}

export default function InfoPopover({ label, children, align = 'left' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <span className="info-popover-wrap">
      <button
        type="button"
        className="info-icon-btn"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        i
      </button>
      {open && (
        <>
          <div className="info-popover-backdrop" onClick={() => setOpen(false)} />
          <div className={`info-popover align-${align}`} role="tooltip">
            {children}
          </div>
        </>
      )}
    </span>
  )
}
