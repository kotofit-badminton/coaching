import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Clip,
  CoachingClass,
  Journey,
  Match,
  OnboardingEvaluation,
  Objective,
  Player,
  SessionNote,
} from '../types'
import { addProgressEntry, generateJourney } from './generateJourney'
import { bandForAge } from './definitions'
import { seedClasses } from './classes'
import { seedClips } from './clips'
import { matches as seedMatches } from './matches'
import { rosterJourneys, rosterOnboarding, rosterPlayers } from './roster'
import { sessionNotes as seedSessionNotes } from './sessionNotes'
import { supabase, supabaseConfigured } from '../lib/supabase'
import {
  fetchOwnBundle,
  fetchStaffBundle,
  getAuthInfo,
  pushClass,
  pushClip,
  pushJourney,
  pushMatch,
  pushNewPlayer,
  pushNote,
  pushOnboarding,
  pushPlayer,
  readPendingPlayer,
  clearPendingPlayer,
  queuePendingPlayer,
  type RealBundle,
} from './cloudSync'

const STORAGE_KEY = 'kotofit-store'
// Bump when the journey/store shape changes so stale saved state is discarded.
const STORAGE_VERSION = 4

// Seed/demo players stay local-only forever. Anything else is a real player
// backed by Supabase once a signed-in session is available.
const MOCK_IDS = new Set(rosterPlayers.map((p) => p.id))
const isRealPlayer = (id: string) => !MOCK_IDS.has(id)

export type ActiveProfile =
  | { kind: 'player'; playerId: string }
  | { kind: 'coach' }
  | { kind: 'admin' }

interface StoreState {
  players: Player[]
  onboarding: OnboardingEvaluation[]
  journeys: Journey[] // one active journey per player
  sessionNotes: SessionNote[]
  matches: Match[]
  clips: Clip[]
  classes: CoachingClass[]
  activeProfile: ActiveProfile | null
}

function seedState(): StoreState {
  return {
    players: rosterPlayers,
    onboarding: rosterOnboarding,
    journeys: rosterJourneys,
    sessionNotes: seedSessionNotes,
    matches: seedMatches,
    clips: seedClips,
    classes: seedClasses,
    activeProfile: null,
  }
}

function loadState(): StoreState {
  const seed = seedState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed
    const parsed = JSON.parse(raw)
    if (parsed?.v !== STORAGE_VERSION || !parsed.state) return seed
    // backfill any keys added since this blob was saved
    return { ...seed, ...(parsed.state as Partial<StoreState>) }
  } catch {
    return seed
  }
}

function persist(state: StoreState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: STORAGE_VERSION, state }))
  } catch {
    /* private mode / quota — fine, stays in memory */
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function mergeById<T extends { id: string }>(base: T[], incoming: T[]): T[] {
  if (incoming.length === 0) return base
  const byId = new Map(base.map((item) => [item.id, item]))
  for (const item of incoming) byId.set(item.id, item)
  return Array.from(byId.values())
}

function mergeBundle(s: StoreState, bundle: RealBundle, classes?: CoachingClass[]): StoreState {
  return {
    ...s,
    players: mergeById(s.players, bundle.players),
    onboarding: mergeById(s.onboarding, bundle.onboarding),
    journeys: mergeById(s.journeys, bundle.journeys),
    sessionNotes: mergeById(s.sessionNotes, bundle.sessionNotes),
    matches: mergeById(s.matches, bundle.matches),
    clips: mergeById(s.clips, bundle.clips),
    classes: classes ? mergeById(s.classes, classes) : s.classes,
  }
}

export interface OnboardInput {
  name: string
  age: number
  objective: Objective
  baselineScores: Record<string, number>
  notes: string
  quizAnswers?: Record<string, string>
  date: string // ISO
}

export interface ProgressInput {
  classesCompleted: number
  scores: Record<string, number>
  coachNote: string
  date: string // ISO
}

export interface NewPlayerBundle {
  id: string
  player: Player
  onboarding: OnboardingEvaluation
  journey: Journey
}

interface StoreValue extends StoreState {
  getPlayer: (id: string) => Player | undefined
  getJourney: (playerId: string) => Journey | undefined
  getOnboarding: (playerId: string) => OnboardingEvaluation | undefined
  onboardPlayer: (input: OnboardInput) => NewPlayerBundle
  reevaluatePlayer: (
    playerId: string,
    patch: { objective?: Objective; baselineScores?: Record<string, number>; notes?: string; coachName?: string; date?: string },
  ) => void
  logJourneyProgress: (playerId: string, input: ProgressInput) => void
  addSessionNote: (note: Omit<SessionNote, 'id'>) => void
  getMatches: (playerId: string) => Match[]
  addMatch: (match: Omit<Match, 'id'>) => void
  getClips: (playerId: string) => Clip[]
  addClip: (clip: Omit<Clip, 'id'>) => void
  createClass: (cls: Omit<CoachingClass, 'id'>) => string
  setClassMembers: (classId: string, memberIds: string[]) => void
  signInAsPlayer: (playerId: string) => void
  signInAsCoach: () => void
  signInAsAdmin: () => void
  signOut: () => void
  resetStore: () => void
  /** Queue a just-registered real player for cloud sync on first confirmed sign-in. */
  queueForCloudSync: (bundle: NewPlayerBundle) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() =>
    typeof window === 'undefined' ? seedState() : loadState(),
  )

  useEffect(() => {
    persist(state)
  }, [state])

  // Pull in real (non-mock) data from Supabase once a session is available,
  // and attach any player that was registered before email confirmation.
  useEffect(() => {
    if (!supabaseConfigured) return
    let alive = true

    async function sync() {
      const auth = await getAuthInfo()
      if (!alive || !auth) return

      if (auth.role === 'player' && !auth.playerId) {
        const pending = readPendingPlayer()
        if (pending) {
          try {
            await pushNewPlayer(pending.player, pending.onboarding, pending.journey)
            clearPendingPlayer()
            auth.playerId = pending.player.id
          } catch {
            /* still pending — retried on next sign-in */
          }
        }
      }

      if (auth.role === 'player') {
        if (!auth.playerId) return
        const bundle = await fetchOwnBundle(auth.playerId)
        if (alive) setState((s) => mergeBundle(s, bundle))
      } else {
        const { classes, ...bundle } = await fetchStaffBundle()
        if (alive) setState((s) => mergeBundle(s, bundle, classes))
      }
    }

    sync()
    const { data: sub } = supabase.auth.onAuthStateChange(() => sync())
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<StoreValue>(() => {
    const getPlayer = (id: string) => state.players.find((p) => p.id === id)
    const getJourney = (playerId: string) =>
      state.journeys.find((j) => j.playerId === playerId)
    const getOnboarding = (playerId: string) =>
      state.onboarding.find((o) => o.playerId === playerId)

    const onboardPlayer: StoreValue['onboardPlayer'] = (input) => {
      const band = bandForAge(input.age)
      const id = `p-${slugify(input.name)}-${Math.random().toString(36).slice(2, 6)}`
      const player: Player = {
        id,
        name: input.name,
        age: input.age,
        band,
        objective: input.objective,
        joinDate: input.date,
        photoUrl: '',
      }
      const onboarding: OnboardingEvaluation = {
        id: `ev-${id}`,
        playerId: id,
        date: input.date,
        coachName: 'Self-registered',
        band,
        objective: input.objective,
        baselineScores: input.baselineScores,
        notes: input.notes,
        quizAnswers: input.quizAnswers,
      }
      const journey = generateJourney(onboarding, { id: `jr-${id}` })
      setState((s) => ({
        ...s,
        players: [...s.players, player],
        onboarding: [...s.onboarding, onboarding],
        journeys: [...s.journeys, journey],
      }))
      return { id, player, onboarding, journey }
    }

    const reevaluatePlayer: StoreValue['reevaluatePlayer'] = (playerId, patch) => {
      const prevEval = state.onboarding.find((o) => o.playerId === playerId)
      const player = state.players.find((p) => p.id === playerId)
      if (!prevEval || !player) return
      const nextEval: OnboardingEvaluation = {
        ...prevEval,
        objective: patch.objective ?? prevEval.objective,
        baselineScores: patch.baselineScores ?? prevEval.baselineScores,
        notes: patch.notes ?? prevEval.notes,
        coachName: patch.coachName ?? prevEval.coachName,
        date: patch.date ?? prevEval.date,
      }
      const prevJourney = state.journeys.find((j) => j.playerId === playerId)
      let nextJourney = generateJourney(nextEval, {
        id: prevJourney?.id ?? `jr-${playerId}`,
      })
      // carry the logged progress across the regeneration
      for (const entry of prevJourney?.progressLog ?? []) {
        nextJourney = addProgressEntry(nextJourney, entry)
      }
      setState((s) => ({
        ...s,
        players: s.players.map((p) =>
          p.id === playerId ? { ...p, objective: nextEval.objective } : p,
        ),
        onboarding: s.onboarding.map((o) => (o.playerId === playerId ? nextEval : o)),
        journeys: s.journeys.map((j) => (j.playerId === playerId ? nextJourney : j)),
      }))
      if (supabaseConfigured && isRealPlayer(playerId)) {
        const nextPlayer = { ...player, objective: nextEval.objective }
        pushPlayer(nextPlayer).catch(() => {})
        pushOnboarding(nextEval).catch(() => {})
        pushJourney(nextJourney).catch(() => {})
      }
    }

    const logJourneyProgress: StoreValue['logJourneyProgress'] = (playerId, input) => {
      const journey = state.journeys.find((j) => j.playerId === playerId)
      if (!journey) return
      const nextJourney = addProgressEntry(journey, {
        id: `jp-${playerId}-${journey.progressLog.length + 1}-${Date.now().toString(36)}`,
        date: input.date,
        classesCompleted: input.classesCompleted,
        scores: input.scores,
        coachNote: input.coachNote,
      })
      setState((s) => ({
        ...s,
        journeys: s.journeys.map((j) => (j.playerId === playerId ? nextJourney : j)),
      }))
      if (supabaseConfigured && isRealPlayer(playerId)) {
        pushJourney(nextJourney).catch(() => {})
      }
    }

    const addSessionNote: StoreValue['addSessionNote'] = (note) => {
      const full: SessionNote = { ...note, id: `sn-${Date.now().toString(36)}` }
      setState((s) => ({ ...s, sessionNotes: [...s.sessionNotes, full] }))
      if (supabaseConfigured && isRealPlayer(full.playerId)) {
        pushNote(full).catch(() => {})
      }
    }

    const getMatches: StoreValue['getMatches'] = (playerId) =>
      (state.matches ?? [])
        .filter((m) => m.playerId === playerId)
        .sort((a, b) => (a.date < b.date ? 1 : -1))

    const addMatch: StoreValue['addMatch'] = (match) => {
      const full: Match = { ...match, id: `match-${Date.now().toString(36)}` }
      setState((s) => ({ ...s, matches: [...s.matches, full] }))
      if (supabaseConfigured && isRealPlayer(full.playerId)) {
        pushMatch(full).catch(() => {})
      }
    }

    const getClips: StoreValue['getClips'] = (playerId) =>
      (state.clips ?? [])
        .filter((c) => c.playerId === playerId)
        .sort((a, b) => (a.date < b.date ? 1 : -1))

    const addClip: StoreValue['addClip'] = (clip) => {
      const full: Clip = { ...clip, id: `clip-${Date.now().toString(36)}` }
      setState((s) => ({ ...s, clips: [...s.clips, full] }))
      if (supabaseConfigured && isRealPlayer(full.playerId)) {
        pushClip(full).catch(() => {})
      }
    }

    const createClass: StoreValue['createClass'] = (cls) => {
      const id = `cls-${slugify(cls.name)}-${Math.random().toString(36).slice(2, 5)}`
      const full: CoachingClass = { ...cls, id }
      setState((s) => ({ ...s, classes: [...s.classes, full] }))
      if (supabaseConfigured) pushClass(full).catch(() => {})
      return id
    }

    const setClassMembers: StoreValue['setClassMembers'] = (classId, memberIds) => {
      const cls = state.classes.find((c) => c.id === classId)
      if (!cls) return
      const full = { ...cls, memberIds }
      setState((s) => ({
        ...s,
        classes: s.classes.map((c) => (c.id === classId ? full : c)),
      }))
      if (supabaseConfigured) pushClass(full).catch(() => {})
    }

    const queueForCloudSync: StoreValue['queueForCloudSync'] = (bundle) => {
      queuePendingPlayer(bundle)
    }

    const signInAsPlayer: StoreValue['signInAsPlayer'] = (playerId) => {
      setState((s) =>
        s.activeProfile?.kind === 'player' && s.activeProfile.playerId === playerId
          ? s
          : { ...s, activeProfile: { kind: 'player', playerId } },
      )
    }

    const signInAsCoach: StoreValue['signInAsCoach'] = () => {
      setState((s) =>
        s.activeProfile?.kind === 'coach' ? s : { ...s, activeProfile: { kind: 'coach' } },
      )
    }

    const signInAsAdmin: StoreValue['signInAsAdmin'] = () => {
      setState((s) =>
        s.activeProfile?.kind === 'admin' ? s : { ...s, activeProfile: { kind: 'admin' } },
      )
    }

    const signOut: StoreValue['signOut'] = () => {
      setState((s) => (s.activeProfile === null ? s : { ...s, activeProfile: null }))
    }

    const resetStore = () => {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* noop */
      }
      setState(seedState())
    }

    return {
      ...state,
      getPlayer,
      getJourney,
      getOnboarding,
      onboardPlayer,
      reevaluatePlayer,
      logJourneyProgress,
      addSessionNote,
      getMatches,
      addMatch,
      getClips,
      addClip,
      createClass,
      setClassMembers,
      queueForCloudSync,
      signInAsPlayer,
      signInAsCoach,
      signInAsAdmin,
      signOut,
      resetStore,
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>')
  return ctx
}
