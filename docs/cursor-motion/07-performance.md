# 07 - Performance: elliptical drift vs waypoint wander

Base: HEAD `3ea8892`. Read from source: section loop (`Hero.tsx`
~568-696), miniature loop (~712-757), chip JSX (~1995), chip CSS
(~980). No source edited, no build, no push.

## Verdict: negligible delta, no cost to watch

Wander changes the position *function*, not the loop. Same rAF
cadence, same reads, same single transform write per chip, same
cleanup. Per-frame math gets cheaper (lerp replaces trig),
per-leg math costs nanoseconds, memory is fixed. No new
battery, paint, or timer cost. The only traps are correctness
traps (stale waypoints on resume), not performance traps.

## What the loop does today (verified, not assumed)

| Item | Section loop (desktop + tablet) | Miniature loop (phone) |
|---|---|---|
| Cadence | rAF, re-armed first each tick; display refresh (60/120Hz) | Same |
| Fixed/frame | 1x `section.getBoundingClientRect()`; offscreen early-return skips writes (loop keeps running, writes skipped) | Same, no word rect |
| Hover extra | 1x `word.getBoundingClientRect()` per frame | None (drift-only) |
| Per chip/frame | 1-2x `offsetWidth` reads, anchor math, 3 trig calls, 1x `el.style.transform = translate(...)` | 3 trig calls, 1x transform write |
| State writes | None (refs only: `wordHoveredRef`, `hoverCapableRef`, `blends` array) | None |
| Timers | None (timestamps: `performance.now()`, `elapsed`, `dt` capped 0.05s) | Same |
| Cleanup | `cancelAnimationFrame(raf)` on band change / unmount | Same |
| Gating | No run under reduced motion; tab-hidden pauses via rAF | Same |

Chip DOM: 4 absolute spans, flex row, pointer-events none,
arrow SVG 14x17 + 11px mono label, inside `.mv-diorama`
(absolute inset 0, z 2, overflow hidden). No `will-change`, no
`translateZ`, no transition on transform (only the 0.8s
entrance opacity fade). Transform writes are the only
per-frame DOM mutation in both loops.

## Update rate: unchanged

Wander does not change cadence. The loop re-arms rAF
unconditionally and computes positions from `now`; swapping
ellipse math for waypoint interpolation leaves the tick
structure, the offscreen early-return, and the reduced-motion
gate untouched. A leg at 70-110 px/s moves ~1.2-1.8px per frame
at 60Hz, vs drift peak ~0.2px: larger steps, same frame count,
same writes.

## Per-frame work: slightly cheaper, unmeasurably so

Drift per chip: `psi`, `theta = psi + 0.35*sin(2*psi)`,
`cos(theta)`, `sin(theta)` = 3 trig calls plus anchor math.
Wander per chip: leg progress `t = (now - legStart) /
legDuration`, one clamp, two lerps = ~6 flops, zero trig.
Converge keeps its clamp + blend + smoothstep math; wander
only replaces the drift input. Honest scale: 4 chips x 3 trig
calls is sub-microsecond per frame against a 16.7ms budget, so
the saving is real but unmeasurable. The `offsetWidth` reads
stay (needed for right-anchored anchor math); they are cheap
here because transform writes never invalidate layout, so the
browser serves them from cached layout.

## Waypoint picking: one pick per leg, negligible

A pick = 2x `Math.random` + bounds clamp + `hypot` +
duration = ~10 flops. Legs last 2-4s per chip, so ~1 pick per
second across 4 chips, each a few nanoseconds. No per-frame
search, no pathfinding, no collision pass.

## Dwell timing: timestamps, no new timers

Pattern (matches the loop's style): per-chip
`{fromX, fromY, toX, toY, legStart, legDuration}` from
`performance.now()`. Per frame, if `now >= legStart +
legDuration`, re-pick. No `setInterval`, no `setTimeout`:
nothing new to clean up, no timer drift. Dwell, if wanted, is
`legStart` pushed forward by the dwell ms: still timestamp
arithmetic, still zero timers.

## Memory: fixed, ~6 numbers per chip, no leak

Per-chip state is 6 numbers (~48 bytes) x 4 chips, allocated
once per effect run. Nothing grows per frame: no history, no
trail, no retained waypoints. Cleanup is exactly today's
`cancelAnimationFrame(raf)`. Two placement rules matter:

- Scope waypoint state inside the effect closure (like
  `blends` today), not in a surviving ref: band change restarts
  the effect, and fresh waypoints are correct because anchors
  change per band. A surviving ref would carry stale waypoints
  from another band's bounds for one leg.
- On re-pick, `from` must be the LAST WRITTEN position, not
  the previous target. After a tab-hidden gap, `t` exceeds 1
  and a re-pick fires on resume: starting from the stale
  target would visibly jump the chip; starting from the last
  written offset does not. Correctness trap, not a cost.

## Mobile / battery: no new cost

Battery cost of a running rAF loop is dominated by keeping
the frame pipeline awake, not by the math inside it, and that
cost is already paid by drift today. Wander adds no wakeups
(no timers), no extra frames, no extra writes, and preserves
tab-hidden pause automatically (rAF stops firing when hidden;
on resume, one re-pick per chip, see above). The miniature
loop is the same at phone scale. If drift's battery cost was
acceptable, wander's is identical to within noise.

## Resize: free if waypoints are anchor offsets

No resize listener exists today, and none is needed: the
stage rect is re-read every frame and anchors are fractions.
Wander inherits this for free ONLY if waypoints are stored as
offsets from the anchor (the same frame as `driftX`/`driftY`
today): a resize then changes nothing. Stored as
stage-absolute positions instead, every resize would need a
clamp or re-pick: do not store them that way. Band change
(720 / 1161) restarts the effect and re-picks anyway.

## Paint risk from larger displacements: none, given 3 conditions

Transform-only writes never trigger layout, and the
compositor moves the layer regardless of distance, so travel
distance itself costs nothing extra. The "no extra paint"
claim holds while: (1) writes stay `translate()` only, never
`left`/`top`/`width` (wander must write the same single
transform property drift writes today); (2) no CSS transition
on transform is added (a transition would interpolate and
force extra style recalculation; today there is none, keep it
none); (3) chips stay small and few (4 chips, max ~130x28px,
inside an overflow-hidden container). `will-change` is not set
today and is not needed at this scale; if a future profiler
ever showed chip paint cost, `will-change: transform` is a
one-line mitigation, not a reason to avoid wander. Larger
travel makes overlap artifacts more visible, but that is a
visual QA concern, not a paint-cost concern.

## What QA should measure (and what it cannot)

| Check | Method | Expectation |
|---|---|---|
| Jank / stutter | Eyeball a full wander cycle on desktop, tablet, miniature | None visible; 4 chips cannot move a 60fps counter |
| Frame time delta | Do not chase it | Sub-microsecond math change; within noise on a 16.7ms budget |
| Battery | Code review, not measurement | No `setInterval`/`setTimeout` added; rAF pause on tab-hidden preserved |
| Band-change reset | Resize across 720 / 1161 boundaries | Chips re-pick cleanly, no one-leg jump to a stale waypoint |
| Tab-hidden resume | Hide tab ~1 min, return | One re-pick per chip from last written position, no jump |
| Paint | DevTools paint flashing only if suspicious | Chip boxes only; no page repaint from transform writes |

Bottom line: ship wander on correctness grounds (waypoint
bounds, converge interplay, visual feel), not on performance
grounds. Performance does not discriminate between drift and
wander at this scale.
