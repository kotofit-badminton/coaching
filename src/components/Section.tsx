import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
  children?: ReactNode
}

export default function Section({ title, subtitle, action, className, children }: Props) {
  return (
    <section className={className ? `card ${className}` : 'card'}>
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
