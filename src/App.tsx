import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import LandingPage from './components/LandingPage'
import PlayerPicker from './components/PlayerPicker'
import PlayerDashboard from './components/player/PlayerDashboard'
import AdminPage from './components/admin/AdminPage'
import CoachPortal from './components/coach/CoachPortal'
import RegisterFlow from './components/register/RegisterFlow'
import LoginPage from './components/auth/LoginPage'
import RoleGate from './components/auth/RoleGate'

function PlayerRoute() {
  const { playerId = '' } = useParams()
  return (
    <RoleGate need={{ kind: 'player', playerId }}>
      <PlayerDashboard />
    </RoleGate>
  )
}

function App() {
  return (
    <div className="app-shell">
      <div className="app-topbar">
        <AppHeader />
      </div>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterFlow />} />
          <Route path="/players" element={<PlayerPicker />} />
          <Route path="/player/:playerId" element={<PlayerRoute />} />
          <Route
            path="/coach"
            element={
              <RoleGate need={{ kind: 'staff', allow: ['coach', 'admin'] }}>
                <CoachPortal />
              </RoleGate>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleGate need={{ kind: 'staff', allow: ['admin'] }}>
                <AdminPage />
              </RoleGate>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">Mockup — seeded data, saved to your browser</footer>
    </div>
  )
}

export default App
