import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ObjectiveGroups, { type ClassPrefill } from './ObjectiveGroups'
import RegisterFlow from '../register/RegisterFlow'
import Classes from './Classes'
import { useStore } from '../../data/store'

type Tab = 'roster' | 'register' | 'classes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'roster', label: 'Roster by objective' },
  { id: 'register', label: 'Register a player' },
  { id: 'classes', label: 'Classes' },
]

export default function AdminPage() {
  const { signInAsAdmin } = useStore()
  const [tab, setTab] = useState<Tab>('roster')
  const [prefill, setPrefill] = useState<ClassPrefill | null>(null)

  useEffect(() => {
    signInAsAdmin()
  }, [])

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin portal</h1>
      <p className="section-subtitle">
        Roster and classes. To evaluate a player or log progress, use the{' '}
        <Link to="/coach">Coach portal</Link>.
      </p>
      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`admin-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'roster' && (
        <ObjectiveGroups
          onCreateClassFromGroup={(p) => {
            setPrefill(p)
            setTab('classes')
          }}
        />
      )}
      {tab === 'register' && <RegisterFlow />}
      {tab === 'classes' && (
        <Classes prefill={prefill} onConsumePrefill={() => setPrefill(null)} />
      )}
    </div>
  )
}
