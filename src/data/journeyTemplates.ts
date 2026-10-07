import type { Band, JourneyTemplate, Objective } from '../types'

/**
 * Authored journey templates, one per (objective x band).
 *
 * The three objectives are deliberately different in *kind*, not just in numbers:
 *
 *  - FUN         — 1 class/week, mostly light sessions, basics and friendly games.
 *  - FITNESS     — 2 classes/week, moderate→high conditioning, badminton as the vehicle.
 *  - COMPETITIVE — 3 classes/week, high intensity throughout, heavy on tactics and
 *                  match play, ending at a real tournament.
 *
 * Each template is a sequence of PHASES. A phase is a run of weeks with one theme,
 * its own drill set and intensity, and a capability payoff — "by the end of this
 * stage the player can …". Phase ends become the checkpoints on the journey map.
 */
export const journeyTemplates: Record<Objective, Record<Band, JourneyTemplate>> = {
  // =========================================================================
  // FUN — love the game, keep coming back
  // =========================================================================
  fun: {
    A: {
      targetSummary:
        'Enjoy every session, rally back and forth with a partner, and play first mini-matches with friends.',
      skillTargets: [
        { metricKey: 'racketShuttleControl', target: 3.5 },
        { metricKey: 'fedRallyConsistency', target: 3.5 },
        { metricKey: 'serveConsistency', target: 3.0 },
        { metricKey: 'directionalMovement', target: 3.0 },
        { metricKey: 'focusCoachability', target: 3.5 },
        { metricKey: 'speed', target: 3.0 },
        { metricKey: 'power', target: 3.0 },
      ],
      ratePerClass: 0.1,
      classesPerWeek: 1,
      minClasses: 12,
      phases: [
        {
          name: 'Get comfortable',
          weight: 2,
          intensity: 'light',
          focusMetricKeys: ['racketShuttleControl', 'serveConsistency'],
          drillIds: ['dt-warmup-games', 'dt-keepy-uppy'],
          weekSummaries: [
            'Fun warm-up games, then keepy-uppy taps — make friends with the shuttle.',
            'Soft feeds and gentle serves over the net. Every try counts.',
          ],
          milestoneLabel: 'Keeps the shuttle up and gets a serve over',
          capability: 'tap the shuttle up a few times in a row and get a serve over the net.',
        },
        {
          name: 'Rally with a partner',
          weight: 2,
          intensity: 'light',
          focusMetricKeys: ['fedRallyConsistency', 'directionalMovement'],
          drillIds: ['dt-coop-rally', 'dt-target-game', 'dt-warmup-games'],
          weekSummaries: [
            'Cooperative rallies — try to beat your own count each time.',
            'Aim at hoops and cones, then rally back and forth with a partner.',
          ],
          milestoneLabel: 'First 10-shot cooperative rally',
          capability: 'rally back and forth with a partner for about 10 shots.',
        },
        {
          name: 'Games & mini-matches',
          weight: 2,
          intensity: 'moderate',
          focusMetricKeys: ['focusCoachability', 'fedRallyConsistency'],
          drillIds: ['dt-king-court', 'dt-mini-match'],
          weekSummaries: [
            'King of the Court — quick games, everyone plays lots of shuttles.',
            'First mini-matches, coach keeps score and keeps it fun.',
          ],
          milestoneLabel: 'Plays a first mini-match',
          capability: 'play a first mini-match and have fun keeping score.',
        },
        {
          name: 'Play with friends',
          weight: 1,
          intensity: 'light',
          focusMetricKeys: ['focusCoachability'],
          drillIds: ['dt-mini-match', 'dt-warmup-games'],
          weekSummaries: ['Bring-a-friend session — social games and team challenges.'],
          milestoneLabel: 'Club social — brings a friend',
          capability: 'come along happily each week and bring a friend to play too.',
        },
      ],
    },
    B: {
      targetSummary:
        'Keep loving the sport, hold longer rallies, and play friendly mini-matches with the group.',
      skillTargets: [
        { metricKey: 'liveRallyLength', target: 3.5 },
        { metricKey: 'serveAccuracy', target: 3.0 },
        { metricKey: 'cornerAccuracy', target: 3.0 },
        { metricKey: 'sixCornerFootwork', target: 3.0 },
        { metricKey: 'staminaEndurance', target: 3.0 },
        { metricKey: 'speed', target: 3.0 },
        { metricKey: 'power', target: 3.0 },
      ],
      ratePerClass: 0.1,
      classesPerWeek: 1,
      minClasses: 12,
      phases: [
        {
          name: 'Get comfortable',
          weight: 2,
          intensity: 'light',
          focusMetricKeys: ['serveAccuracy', 'liveRallyLength'],
          drillIds: ['dt-warmup-games', 'dt-keepy-uppy', 'dt-coop-rally'],
          weekSummaries: [
            'Warm-up games, then keepy-uppy — just get a feel for the shuttle.',
            'Gentle fed rallies and an easy serve into the box. No pressure.',
          ],
          milestoneLabel: 'Serves in and rallies with a partner',
          capability: 'serve so it lands in and keep an easy rally going with a partner.',
        },
        {
          name: 'Rally, rally, rally',
          weight: 2,
          intensity: 'light',
          focusMetricKeys: ['liveRallyLength', 'cornerAccuracy'],
          drillIds: ['dt-coop-rally', 'dt-target-game', 'dt-warmup-games'],
          weekSummaries: [
            'Cooperative rally challenge — how long can you and a partner keep it alive?',
            'Hoop and cone target games, then a rally streak to beat last week.',
          ],
          milestoneLabel: '12-shot cooperative rally',
          capability:
            'keep a cooperative rally going for 12+ shots and place it to a couple of spots.',
        },
        {
          name: 'Games & mini-matches',
          weight: 2,
          intensity: 'moderate',
          focusMetricKeys: ['sixCornerFootwork', 'liveRallyLength'],
          drillIds: ['dt-king-court', 'dt-mini-match', 'dt-target-game'],
          weekSummaries: [
            'King of the Court — lots of shuttles, lots of laughs.',
            'Mini-matches with light scoring. Put the skills into a real game.',
          ],
          milestoneLabel: 'Plays a scored mini-match',
          capability: 'play a fun mini-match, keep score, and enjoy the back-and-forth.',
        },
        {
          name: 'Play with friends',
          weight: 1,
          intensity: 'light',
          focusMetricKeys: ['staminaEndurance'],
          drillIds: ['dt-mini-match', 'dt-king-court'],
          weekSummaries: ['Social games, mixed partners, bring a friend along.'],
          milestoneLabel: 'Club social — brings a friend',
          capability: 'join in social games with the group and look forward to coming back.',
        },
      ],
    },
  },

  // =========================================================================
  // FITNESS — athleticism and a healthy habit
  // =========================================================================
  fitness: {
    A: {
      targetSummary:
        'Move better and last longer — quicker feet, sharper reactions, and the stamina to play all session.',
      skillTargets: [
        { metricKey: 'directionalMovement', target: 4.0 },
        { metricKey: 'reactionCoordination', target: 4.0 },
        { metricKey: 'fedRallyConsistency', target: 3.5 },
        { metricKey: 'racketShuttleControl', target: 3.0 },
        { metricKey: 'focusCoachability', target: 3.5 },
        { metricKey: 'speed', target: 4.0 },
        { metricKey: 'power', target: 3.5 },
      ],
      ratePerClass: 0.12,
      classesPerWeek: 2,
      minClasses: 18,
      phases: [
        {
          name: 'Move to the shuttle',
          weight: 2,
          intensity: 'moderate',
          focusMetricKeys: ['directionalMovement'],
          drillIds: ['dt-dynamic-warmup', 'dt-agility-ladder', 'dt-warmup-games', 'dt-mobility-cooldown'],
          weekSummaries: [
            "Warm-up, ladder games and 'run to the shuttle' — move in every direction.",
            'Chase games and cone runs. Change direction and get low.',
          ],
          milestoneLabel: 'Moves to the shuttle in every direction',
          capability:
            'move quickly to the shuttle in any direction and get back to the middle.',
        },
        {
          name: 'Quick feet, quick hands',
          weight: 2,
          intensity: 'high',
          focusMetricKeys: ['reactionCoordination', 'directionalMovement'],
          drillIds: ['dt-dynamic-warmup', 'dt-cone-shuttle', 'dt-reaction-multi', 'dt-mobility-cooldown'],
          weekSummaries: [
            'Cone sprints and catch-react games. Beat the whistle.',
            'Rapid feeds to surprise spots — react and go.',
          ],
          milestoneLabel: 'Fast reactions and coordination',
          capability: 'react fast to a surprise feed, with sharp hand-eye coordination.',
        },
        {
          name: 'Last the session',
          weight: 2,
          intensity: 'high',
          focusMetricKeys: ['reactionCoordination', 'fedRallyConsistency'],
          drillIds: ['dt-multi-shuttle', 'dt-king-court', 'dt-dynamic-warmup'],
          weekSummaries: [
            "Multi-shuttle bursts and King of the Court — keep going when it's tiring.",
            'Longer rally games so the engine keeps working.',
          ],
          milestoneLabel: 'Keeps going for a full session',
          capability:
            'keep moving and playing hard for a whole session without fading.',
        },
        {
          name: 'Show your progress',
          weight: 1,
          intensity: 'moderate',
          focusMetricKeys: ['directionalMovement'],
          drillIds: ['dt-agility-ladder', 'dt-cone-shuttle', 'dt-coop-rally'],
          weekSummaries: ['Retest the fun fitness games and beat your first-week scores.'],
          milestoneLabel: 'Beats your first-week scores',
          capability: 'beat the scores you set in your first week on every fitness game.',
        },
      ],
    },
    B: {
      targetSummary:
        'Build real on-court athleticism — fast, clean footwork and the endurance to hold intensity for a full session.',
      skillTargets: [
        { metricKey: 'sixCornerFootwork', target: 4.0 },
        { metricKey: 'staminaEndurance', target: 4.0 },
        { metricKey: 'liveRallyLength', target: 3.5 },
        { metricKey: 'serveAccuracy', target: 3.0 },
        { metricKey: 'cornerAccuracy', target: 3.0 },
        { metricKey: 'speed', target: 4.0 },
        { metricKey: 'power', target: 3.5 },
      ],
      ratePerClass: 0.12,
      classesPerWeek: 2,
      minClasses: 18,
      phases: [
        {
          name: 'Move well',
          weight: 2,
          intensity: 'moderate',
          focusMetricKeys: ['sixCornerFootwork'],
          drillIds: ['dt-dynamic-warmup', 'dt-agility-ladder', 'dt-shadow-footwork', 'dt-mobility-cooldown'],
          weekSummaries: [
            'Dynamic warm-up, ladder work and shadow footwork — clean movement first.',
            'Six-point footwork, timed. Recover to centre every rep.',
          ],
          milestoneLabel: 'Clean footwork to every corner',
          capability:
            'move to all six court points with clean footwork and recover to centre.',
        },
        {
          name: 'Build the engine',
          weight: 3,
          intensity: 'high',
          focusMetricKeys: ['staminaEndurance'],
          drillIds: ['dt-dynamic-warmup', 'dt-cone-shuttle', 'dt-multi-shuttle', 'dt-mobility-cooldown'],
          weekSummaries: [
            'Cone shuttle runs into a multi-shuttle feed. Short rest, high heart rate.',
            'Repeat sprint efforts, then a conditioning feed to finish.',
          ],
          milestoneLabel: 'Holds intensity most of a session',
          capability:
            'hold high intensity for most of a session and repeat sprints with short rest.',
        },
        {
          name: 'Sharpen & sustain',
          weight: 2,
          intensity: 'high',
          focusMetricKeys: ['sixCornerFootwork', 'staminaEndurance'],
          drillIds: ['dt-dynamic-warmup', 'dt-reaction-multi', 'dt-agility-ladder', 'dt-6point'],
          weekSummaries: [
            'Reaction multi-shuttle to random spots — fast feet when tired.',
            "Ladder and footwork at the end of the session, when it's hardest.",
          ],
          milestoneLabel: 'Fast reactions under fatigue',
          capability:
            'react quickly to random feeds and keep your footwork sharp even when tired.',
        },
        {
          name: 'Test & prove',
          weight: 1,
          intensity: 'moderate',
          focusMetricKeys: ['liveRallyLength', 'staminaEndurance'],
          drillIds: ['dt-cone-shuttle', 'dt-6point', 'dt-coop-rally'],
          weekSummaries: [
            'Re-run the shuttle-run, footwork drill and rally-endurance tests. Beat your baseline.',
          ],
          milestoneLabel: 'Beats baseline fitness tests',
          capability:
            'beat your starting numbers on the shuttle-run, footwork drill and rally-endurance tests.',
        },
      ],
    },
  },

  // =========================================================================
  // COMPETITIVE — play tournaments and earn a rating
  // =========================================================================
  competitive: {
    A: {
      targetSummary:
        'Get ready for junior competition — all the basic shots, quick footwork, and a first taste of scored matches.',
      skillTargets: [
        { metricKey: 'racketShuttleControl', target: 3.5 },
        { metricKey: 'fedRallyConsistency', target: 3.5 },
        { metricKey: 'serveConsistency', target: 3.5 },
        { metricKey: 'directionalMovement', target: 3.5 },
        { metricKey: 'reactionCoordination', target: 3.5 },
        { metricKey: 'focusCoachability', target: 4.0 },
        { metricKey: 'speed', target: 3.5 },
        { metricKey: 'power', target: 3.5 },
      ],
      ratePerClass: 0.16,
      classesPerWeek: 3,
      minClasses: 27,
      phases: [
        {
          name: 'Junior fundamentals',
          weight: 2,
          intensity: 'moderate',
          focusMetricKeys: ['racketShuttleControl', 'serveConsistency'],
          drillIds: ['dt-dynamic-warmup', 'dt-4corner', 'dt-drop-practice'],
          weekSummaries: [
            'Warm-up, then direct the shuttle to targets and try a first soft drop.',
            'Clean contact on clears and serves. Same motion every time.',
          ],
          milestoneLabel: 'Directs the shuttle to targets',
          capability: 'hit clears and serves cleanly and aim them at a target.',
        },
        {
          name: 'Quick around the court',
          weight: 2,
          intensity: 'high',
          focusMetricKeys: ['directionalMovement', 'reactionCoordination'],
          drillIds: ['dt-dynamic-warmup', 'dt-6point', 'dt-multi-shuttle'],
          weekSummaries: [
            'Six-point footwork and quick feeds — move fast, recover to the middle.',
            'Multi-shuttle bursts so movement holds up when tired.',
          ],
          milestoneLabel: 'Fast to every corner and back',
          capability:
            'move quickly to every corner and get back to the middle ready for the next shot.',
        },
        {
          name: 'Play the point',
          weight: 2,
          intensity: 'moderate',
          focusMetricKeys: ['fedRallyConsistency', 'focusCoachability'],
          drillIds: ['dt-dynamic-warmup', 'dt-pattern-play', 'dt-situational-points'],
          weekSummaries: [
            'Simple patterns — clear, drop, net — and a first go at picking the right shot.',
            'Play points from a set-up and try to make a plan work.',
          ],
          milestoneLabel: 'Chooses a shot with a plan',
          capability:
            'keep a rally going and pick a shot with a simple plan in mind.',
        },
        {
          name: 'First competitions',
          weight: 1,
          intensity: 'moderate',
          focusMetricKeys: ['focusCoachability'],
          drillIds: ['dt-dynamic-warmup', 'dt-match-sim', 'dt-tournament-prep'],
          weekSummaries: [
            'Scored mini-matches, a warm-up routine and a first junior round-robin.',
          ],
          milestoneLabel: 'Plays a first junior tournament',
          capability:
            'play scored matches with a routine and take part in a first junior round-robin.',
        },
      ],
    },
    B: {
      targetSummary:
        'Become match-ready — tactical rallies, a full shot set, footwork under pressure, and a first sanctioned tournament on the way to a DUBR rating.',
      skillTargets: [
        { metricKey: 'cornerAccuracy', target: 4.0 },
        { metricKey: 'serveAccuracy', target: 4.0 },
        { metricKey: 'liveRallyLength', target: 4.0 },
        { metricKey: 'shotSelection', target: 4.0 },
        { metricKey: 'sixCornerFootwork', target: 4.0 },
        { metricKey: 'staminaEndurance', target: 4.0 },
        { metricKey: 'matchPerformance', target: 4.0 },
        { metricKey: 'speed', target: 4.0 },
        { metricKey: 'power', target: 4.0 },
      ],
      ratePerClass: 0.16,
      classesPerWeek: 3,
      minClasses: 30,
      phases: [
        {
          name: 'Foundations',
          weight: 2,
          intensity: 'high',
          focusMetricKeys: ['cornerAccuracy', 'serveAccuracy'],
          drillIds: ['dt-dynamic-warmup', 'dt-4corner', 'dt-drop-practice', 'dt-shadow-footwork'],
          weekSummaries: [
            'Repeatable technique on clears, drops and serves under a light feed.',
            'Four-corner accuracy with a taped target. Same swing every time.',
          ],
          milestoneLabel: 'Repeatable technique on every shot',
          capability:
            'hit clears, drops and serves with the same repeatable technique and land them in the right area.',
        },
        {
          name: 'Shot-making under pressure',
          weight: 2,
          intensity: 'high',
          focusMetricKeys: ['cornerAccuracy', 'sixCornerFootwork'],
          drillIds: ['dt-dynamic-warmup', 'dt-6point', 'dt-drop-net', 'dt-multi-shuttle'],
          weekSummaries: [
            'Six-point footwork and drop-and-net combos at speed.',
            'Place all four corners at pace, then a conditioning feed.',
          ],
          milestoneLabel: 'Places all 4 corners at pace',
          capability:
            'place the shuttle to all four corners at speed and recover to centre.',
        },
        {
          name: 'Tactical rallies',
          weight: 3,
          intensity: 'high',
          focusMetricKeys: ['shotSelection', 'liveRallyLength'],
          drillIds: ['dt-dynamic-warmup', 'dt-pattern-play', 'dt-situational-points', 'dt-multi-shuttle'],
          weekSummaries: [
            "Pattern play — clear, drop, net, lift — until it's automatic.",
            "Situational points: choose the shot off the opponent's position.",
          ],
          milestoneLabel: 'Wins 15-shot tactical rallies',
          capability:
            "build and win 15+ shot rallies by choosing shots off the opponent's position.",
        },
        {
          name: 'Match craft',
          weight: 2,
          intensity: 'high',
          focusMetricKeys: ['matchPerformance', 'staminaEndurance'],
          drillIds: ['dt-dynamic-warmup', 'dt-match-sim', 'dt-situational-points'],
          weekSummaries: [
            'Full match simulation with scoring and a between-games debrief.',
            'Serving at 19-19, defending the smash — rehearse the moments that decide games.',
          ],
          milestoneLabel: 'Competes on the club ladder',
          capability:
            'hold a game plan, manage the score, and compete at club-ladder level.',
        },
        {
          name: 'Tournament ready',
          weight: 1,
          intensity: 'high',
          focusMetricKeys: ['matchPerformance', 'shotSelection'],
          drillIds: ['dt-dynamic-warmup', 'dt-tournament-prep', 'dt-match-sim'],
          weekSummaries: [
            'Warm-up routine, between-point rituals, nerves plan — then play your first tournament.',
          ],
          milestoneLabel: 'First sanctioned tournament',
          capability:
            'warm up, manage nerves and play your first sanctioned tournament — the on-ramp to a DUBR rating.',
        },
      ],
    },
  },
}

export const objectiveLabels: Record<Objective, string> = {
  fun: 'For fun',
  fitness: 'Fitness',
  competitive: 'Competitive',
}

export const objectiveBlurbs: Record<Objective, string> = {
  fun: 'Enjoy the game and keep coming back. One relaxed class a week — basics, rallies and friendly games.',
  fitness:
    'Get fitter and more athletic. Two active classes a week — quick feet, agility and stamina, with badminton as the way in.',
  competitive:
    'Learn to compete and play tournaments. Three focused classes a week — all the shots, tactics and match play.',
}

export const intensityLabels: Record<'light' | 'moderate' | 'high', string> = {
  light: 'Easy',
  moderate: 'Medium',
  high: 'Tough',
}

/** Strip a leading "You can " / "You " (older data stored the phrase that way). */
export function capabilityPhrase(phrase: string): string {
  return phrase.replace(/^you\s+(can\s+)?/i, '')
}

/**
 * Turn a bare capability phrase ("place all four corners at pace") into a full
 * sentence with the player's name: "Ava will be able to place all four corners
 * at pace" — or, once reached, "Ava can now place all four corners at pace".
 */
export function capabilityLine(subject: string, phrase: string, reached = false): string {
  const s = subject.trim() || 'They'
  const p = capabilityPhrase(phrase)
  return reached ? `${s} can now ${p}` : `${s} will be able to ${p}`
}
