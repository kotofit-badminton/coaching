# KotoFit Player Journey — Product Spec (Mockup v1)

## Context
KotoFit is a badminton/pickleball/pingpong academy (Jersey City, NY). This mockup is a
**parent-facing dashboard** showing a single kid's coaching journey — designed to make
progress memorable and trackable for parents and coaches. It should integrate with the
scoring philosophy of **DUBR** (KotoFit's existing rating/matchmaking platform).

Scope for v1: **kids only**, one age band at a time, **one sample player**, parent view only.
Coach input view, adults, and visual branding are explicitly out of scope for this pass —
functionality first.

---

## Age bands
Metrics and rating rubrics are **not shared** across bands. Each player is assigned to a
band, and the app loads that band's metric set + rubric definitions accordingly.

- **Band A: Ages 5–8** — "Fundamentals stage." Focus on coordination, control, coachability.
  No tactical/strategy metric exists in this band (not scored low — simply not measured yet).
- **Band B: Ages 9–13** — "Development stage." Focus on precision, live rally play, tactics,
  and physical capacity. Closer to a junior on-ramp to the full adult DUBR rating.

---

## Metric bank (full reference list)

### 1. Technical skills
Serve accuracy (short/long), racket-shuttle control (keepy-uppy count), fed-rally
consistency, clear, drop shot, smash, net play, corner-to-corner accuracy (4 corners),
cross-court vs straight conversion, backhand development.

### 2. Tactical/strategic (9–13 only)
Shot selection, reading opponent position, live rally length, point construction,
match performance vs. expected outcome (DUBR-style), adaptability.

### 3. Movement & footwork
Directional movement to fed shuttle (5–8), 6-corner footwork drill (9–13), split-step
timing, recovery speed to center.

### 4. Physical fitness
Endurance/stamina, speed/agility (shuttle run/cone drill), jump (vertical/broad),
reaction time, coordination (balance, catch/throw), flexibility/mobility.

### 5. Behavioral/soft metrics
Focus & instruction-following, coachability, sportsmanship, confidence on court,
attendance/effort consistency, enjoyment/engagement.

### 6. Milestone triggers (event-based, not scored — drive badges)
First live rally of X shots, first clean smash, first tournament/friendly match,
3/6/12-month training anniversary, new personal-best rally length.

---

## Headline metrics + rubric anchors

### Band A: Ages 5–8 (6 headline metrics)

| Metric | Weight | 1 | 3 | 5 |
|---|---|---|---|---|
| Racket-shuttle control | 20% | Can't sustain control | Occasional short control | Consistent extended control |
| Fed-rally consistency | 20% | Returns 0–1 in a row | Returns 4–6 in a row | Sustains 10+ w/ placement |
| Serve consistency (in-court) | 15% | Rarely clears net/lands in | Lands in ~half the time | Consistently in box w/ shape |
| Directional movement | 15% | Doesn't move to shuttle | Moves to some directions | Moves all directions, recovers to center |
| Reaction & coordination | 15% | Slow/inconsistent reaction | Reacts reliably to obvious cues | Reacts quickly, good hand-eye |
| Focus & coachability | 15% | Distracted, doesn't apply feedback | Applies feedback sometimes | Applies feedback same session |

*No tactical/strategy metric in this band.*

### Band B: Ages 9–13 (7 headline metrics)

| Metric | Weight | 1 | 3 | 5 |
|---|---|---|---|---|
| Corner accuracy (4-corner) | 18% | Can't direct to any corner | Directs to 3–4 w/ moderate accuracy | Places accurately + disguises intent |
| Serve accuracy (target zone) | 15% | Often out/into net | Lands in correct half | Hits target zone under pressure |
| Live rally length | 15% | Rallies end in 1–3 shots | ~6–9 shot rallies | Sustains 15+ shot tactical rallies |
| Shot selection/strategy | 15% | Hits whatever's easiest | Selects shot sometimes appropriately | Chooses shot based on opponent position |
| 6-corner footwork | 15% | Slow/incomplete pattern | Completes pattern moderately well | Fast, clean footwork under drill |
| Stamina/endurance | 12% | Fades quickly | Holds intensity ~half session | Holds intensity full session |
| Match performance vs. expected | 10% | Underperforms expected rating | Matches expected rating | Outperforms expected rating |

**Overall rating formula:** `Overall = Σ(metric score × weight)`, each metric scored 1–5
per that band's rubric, rounded to 1 decimal (e.g. `3.4 / 5`). Same 1–5 scale used across
both bands for parent legibility, but the *definition* of each number differs by band.

---

## Data model

```
Player
  - id, name, age, band (A|B), join_date, photo_url

Assessment  (one per coach check-in, e.g. monthly)
  - id, player_id, date
  - metric_scores: { metric_key: 1-5, ... }   // only that band's headline metrics
  - computed_overall_rating
  - coach_notes (freeform)
  - media: [ { type: photo|video, url, caption } ]

Milestone
  - id, player_id, title, trigger_type (time|rating|skill), unlocked_date, badge_icon

Badge (reference table)
  - id, title, description, icon
```

---

## Dashboard sections (parent view)

1. **Journey overview** — name, photo, "training since [date]", current band, overall rating
2. **Rating trend** — line chart of `computed_overall_rating` across assessments
3. **Metric breakdown** — current scores per headline metric, each with its own mini-trend
4. **Milestones/badges** — timeline of unlocked badges + next milestone "in progress"
5. **Media journal** — photos/videos tied to assessment dates, scrollable timeline
6. **Coach notes** — freeform note per assessment, most recent first

---

## v1 build scope
- Single sample player, Band A **or** Band B (pick one to start)
- ~5 months of seeded/mock assessment data so trends are visible
- Parent view only (read-only), no coach input UI yet
- No auth, no backend — mock data in-memory or local JSON
- Visual design/branding deferred — functional layout only for this pass
