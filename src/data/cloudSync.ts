// Bridges the local store to Supabase for real (non-mock) accounts.
// Mock/demo players never touch this file — they stay purely local.
import { supabase } from '../lib/supabase'
import type {
  Clip,
  CoachingClass,
  Journey,
  Match,
  OnboardingEvaluation,
  Player,
  SessionNote,
} from '../types'

const PENDING_KEY = 'kotofit-pending-player'

type RecordKind = 'journey' | 'note' | 'match' | 'clip' | 'onboarding'

export interface RealBundle {
  players: Player[]
  onboarding: OnboardingEvaluation[]
  journeys: Journey[]
  sessionNotes: SessionNote[]
  matches: Match[]
  clips: Clip[]
}

export interface AuthInfo {
  userId: string
  role: 'player' | 'coach' | 'admin'
  playerId: string | null
}

export async function getAuthInfo(): Promise<AuthInfo | null> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) return null
  const { data } = await supabase
    .from('profiles')
    .select('role, player_id')
    .eq('id', userId)
    .maybeSingle()
  return {
    userId,
    role: (data?.role as AuthInfo['role']) ?? 'player',
    playerId: data?.player_id ?? null,
  }
}

function emptyBundle(): RealBundle {
  return { players: [], onboarding: [], journeys: [], sessionNotes: [], matches: [], clips: [] }
}

function splitRecords(rows: { id: string; player_id: string; kind: RecordKind; data: unknown }[]): Omit<RealBundle, 'players'> {
  const bundle = emptyBundle()
  for (const row of rows) {
    switch (row.kind) {
      case 'onboarding':
        bundle.onboarding.push(row.data as OnboardingEvaluation)
        break
      case 'journey':
        bundle.journeys.push(row.data as Journey)
        break
      case 'note':
        bundle.sessionNotes.push(row.data as SessionNote)
        break
      case 'match':
        bundle.matches.push(row.data as Match)
        break
      case 'clip':
        bundle.clips.push(row.data as Clip)
        break
    }
  }
  return bundle
}

/** One parent's own player and everything attached to it. */
export async function fetchOwnBundle(playerId: string): Promise<RealBundle> {
  const [{ data: playerRow }, { data: recordRows }] = await Promise.all([
    supabase.from('players').select('id, data').eq('id', playerId).maybeSingle(),
    supabase.from('records').select('id, player_id, kind, data').eq('player_id', playerId),
  ])
  const rest = splitRecords((recordRows ?? []) as Parameters<typeof splitRecords>[0])
  return {
    ...rest,
    players: playerRow ? [playerRow.data as Player] : [],
  }
}

/** Everything a coach/admin can see: every real (non-mock) player. */
export async function fetchStaffBundle(): Promise<RealBundle & { classes: CoachingClass[] }> {
  const [{ data: playerRows }, { data: recordRows }, { data: classRows }] = await Promise.all([
    supabase.from('players').select('id, data').eq('is_mock', false),
    supabase.from('records').select('id, player_id, kind, data'),
    supabase.from('classes').select('id, data'),
  ])
  const rest = splitRecords((recordRows ?? []) as Parameters<typeof splitRecords>[0])
  return {
    ...rest,
    players: (playerRows ?? []).map((r) => r.data as Player),
    classes: (classRows ?? []).map((r) => r.data as CoachingClass),
  }
}

/** Create the player + its initial records in Supabase, and attach it to the signed-in profile. */
export async function pushNewPlayer(
  player: Player,
  onboarding: OnboardingEvaluation,
  journey: Journey,
): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) throw new Error('no session')

  // Order matters: the records-insert RLS policy checks that this profile's
  // player_id already matches, so the player must exist and be attached
  // to the profile before any records can be written for it.
  await supabase.from('players').insert({ id: player.id, is_mock: false, data: player })
  await supabase.from('profiles').update({ player_id: player.id }).eq('id', userId)
  await supabase.from('records').insert([
    { id: `${player.id}-onboarding`, player_id: player.id, kind: 'onboarding', data: onboarding },
    { id: `${player.id}-journey`, player_id: player.id, kind: 'journey', data: journey },
  ])
}

export async function pushJourney(journey: Journey): Promise<void> {
  await supabase
    .from('records')
    .upsert({ id: `${journey.playerId}-journey`, player_id: journey.playerId, kind: 'journey', data: journey })
}

export async function pushOnboarding(onboarding: OnboardingEvaluation): Promise<void> {
  await supabase.from('records').upsert({
    id: `${onboarding.playerId}-onboarding`,
    player_id: onboarding.playerId,
    kind: 'onboarding',
    data: onboarding,
  })
}

export async function pushPlayer(player: Player): Promise<void> {
  await supabase.from('players').upsert({ id: player.id, is_mock: false, data: player })
}

export async function pushNote(note: SessionNote): Promise<void> {
  await supabase.from('records').insert({ id: note.id, player_id: note.playerId, kind: 'note', data: note })
}

export async function pushMatch(match: Match): Promise<void> {
  await supabase.from('records').insert({ id: match.id, player_id: match.playerId, kind: 'match', data: match })
}

export async function pushClip(clip: Clip): Promise<void> {
  await supabase.from('records').insert({ id: clip.id, player_id: clip.playerId, kind: 'clip', data: clip })
}

export async function pushClass(cls: CoachingClass): Promise<void> {
  await supabase.from('classes').upsert({ id: cls.id, data: cls })
}

// --- Pending player: a real signup that happened before email confirmation,
// queued locally until the first real sign-in can attach it to the profile.

export interface PendingPlayer {
  player: Player
  onboarding: OnboardingEvaluation
  journey: Journey
}

export function queuePendingPlayer(pending: PendingPlayer) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending))
  } catch {
    /* private mode / quota — the player still exists locally in store state */
  }
}

export function readPendingPlayer(): PendingPlayer | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    return raw ? (JSON.parse(raw) as PendingPlayer) : null
  } catch {
    return null
  }
}

export function clearPendingPlayer() {
  try {
    localStorage.removeItem(PENDING_KEY)
  } catch {
    /* noop */
  }
}
