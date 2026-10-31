import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../../data/store'
import JourneyProjection from '../journey/JourneyProjection'
import JourneyMap from '../journey/JourneyMap'
import JourneyProgressTimeline from '../journey/JourneyProgressTimeline'
import PlayerNav, { type NavGroup } from './PlayerNav'
import PlayerOverview from './PlayerOverview'
import PlayerBlockReview from './PlayerBlockReview'
import PlayerRatingTrend from './PlayerRatingTrend'
import PlayerAttendance from './PlayerAttendance'
import PlayerFocusAreas from './PlayerFocusAreas'
import PlayerNextUp from './PlayerNextUp'
import PlayerDrills from './PlayerDrills'
import PlayerHomework from './PlayerHomework'
import PlayerGoals from './PlayerGoals'
import LifeMilestones from './LifeMilestones'
import PlayerMatches from './PlayerMatches'
import PlayerClips from './PlayerClips'
import PlayerDiary from './PlayerDiary'
import StrokeCards from './StrokeCards'
import ProgressTabs from './ProgressTabs'

export default function PlayerDashboard() {
  const { playerId = '' } = useParams()
  const { getPlayer, getJourney, getOnboarding, signInAsPlayer } = useStore()
  const [view, setView] = useState('overview')

  const player = getPlayer(playerId)

  useEffect(() => {
    if (player) signInAsPlayer(player.id)
  }, [player?.id])

  useEffect(() => {
    setView('overview')
  }, [playerId])

  if (!player) {
    return (
      <section className="card">
        <h2>Player not found</h2>
        <p className="section-subtitle">
          <Link to="/players">Pick a player</Link> or{' '}
          <Link to="/register">register a new one</Link>.
        </p>
      </section>
    )
  }

  const journey = getJourney(player.id)
  const onboarding = getOnboarding(player.id)
  const band = player.band
  const name = player.name

  if (!journey) {
    return (
      <section className="card">
        <p className="jrny-empty">
          {name} has no plan yet — <Link to="/register">run a registration</Link>.
        </p>
      </section>
    )
  }

  const groups: NavGroup[] = [
    { items: [{ id: 'overview', label: 'Overview' }] },
    { items: [{ id: 'plan', label: 'Plan' }] },
    { items: [{ id: 'progress', label: 'How they are doing' }] },
    { items: [{ id: 'diary', label: 'Diary & updates' }] },
  ]

  function panel() {
    if (!journey) return null
    switch (view) {
      case 'overview':
        return (
          <>
            <PlayerOverview
              player={player!}
              journey={journey}
              onboarding={onboarding}
              band={band}
              onNavigate={setView}
            />
            <PlayerBlockReview player={player!} journey={journey} />
            <JourneyProjection journey={journey} subjectName={name} />
          </>
        )
      case 'plan':
        return (
          <ProgressTabs
            key={player!.id}
            tabs={[
              {
                id: 'map',
                label: 'Map',
                content: (
                  <>
                    <PlayerNextUp journey={journey} band={band} />
                    <JourneyMap journey={journey} band={band} subjectName={name} />
                  </>
                ),
              },
              {
                id: 'practice',
                label: 'Practice',
                content: (
                  <>
                    <PlayerDrills journey={journey} />
                    <PlayerHomework journey={journey} band={band} />
                  </>
                ),
              },
              { id: 'attendance', label: 'Attendance', content: <PlayerAttendance journey={journey} /> },
            ]}
          />
        )
      case 'progress':
        return (
          <>
            <PlayerRatingTrend journey={journey} />
            <ProgressTabs
              key={player!.id}
              tabs={[
                { id: 'every', label: 'Skills', content: <StrokeCards journey={journey} band={band} /> },
                {
                  id: 'goals',
                  label: 'Goals',
                  content: (
                    <>
                      <PlayerGoals journey={journey} band={band} />
                      <LifeMilestones player={player!} journey={journey} />
                    </>
                  ),
                },
                { id: 'work', label: 'Next steps', content: <PlayerFocusAreas journey={journey} band={band} /> },
              ]}
            />
          </>
        )
      case 'diary':
        return (
          <ProgressTabs
            key={player!.id}
            tabs={[
              { id: 'diary', label: 'Diary', content: <PlayerDiary playerId={player!.id} playerName={name} /> },
              { id: 'updates', label: 'Coach updates', content: <JourneyProgressTimeline journey={journey} band={band} /> },
              {
                id: 'media',
                label: 'Matches & clips',
                content: (
                  <>
                    <PlayerMatches playerId={player!.id} playerName={name} />
                    <PlayerClips playerId={player!.id} playerName={name} />
                  </>
                ),
              },
            ]}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="player-view with-side">
      <PlayerNav groups={groups} value={view} onChange={setView} />
      <div className="player-panel">{panel()}</div>
    </div>
  )
}
