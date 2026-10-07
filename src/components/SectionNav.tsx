import { useEffect, useState } from 'react'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'headed', label: 'The plan' },
  { id: 'plan', label: 'Week by week' },
  { id: 'week', label: 'This week' },
  { id: 'skills', label: 'Skills' },
  { id: 'progress', label: 'Your level' },
  { id: 'more', label: 'More detail' },
]

export default function SectionNav() {
  const [active, setActive] = useState(sections[0].id)
  const [present, setPresent] = useState<string[]>(() => sections.map((s) => s.id))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        )
        setActive(topMost.target.id)
      },
      { rootMargin: '-110px 0px -70% 0px', threshold: 0 },
    )
    const found: string[] = []
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) {
        observer.observe(el)
        found.push(s.id)
      }
    }
    setPresent(found)
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="section-nav" aria-label="Dashboard sections">
      <div className="section-nav-scroll">
        {sections
          .filter((s) => present.includes(s.id))
          .map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`section-nav-link${active === s.id ? ' active' : ''}`}
            >
              {s.label}
            </a>
          ))}
      </div>
    </nav>
  )
}
